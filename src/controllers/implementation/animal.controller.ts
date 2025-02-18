import { Request, Response } from "express";
import AnimalReportService from "../../services/implementation/animal.service";
import { createResponse } from "../../utilities/createResponse.utils";
import { HttpStatus } from "../../enums/http-status.enum";
import { UploadedFile } from "../../entities/upload-file.interface";
import { FCMService } from "../../services/implementation/fcm.service";
import { RecruiterAlertService } from "../../services/implementation/recruiter-alert.service";
import { RecruiterService } from "../../services/implementation/recruiter.service";
import exifParser from 'exif-parser';
import s3Client from "../../config/s3.cofig";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { sdkStreamMixin } from "@aws-sdk/util-stream-node";
import { Readable } from "stream";
import axios from 'axios'

class AnimalReportController {

    constructor(private animalService:AnimalReportService,
      private fcmService:FCMService,
      private recruiterAlertService:RecruiterAlertService,
      private recruiterService:RecruiterService
    ){}

    streamToBuffer(stream: Readable): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    }

    async getObjectFromS3(bucket: string, key: string): Promise<Buffer> {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
    
      try {
        const response = await s3Client.send(command);
            if (response.Body instanceof Readable) {
          const stream = sdkStreamMixin(response.Body);
          return await this.streamToBuffer(stream);
        } else {
          throw new Error('Unsupported response body type');
        }
      } catch (error) {
        console.error('Error fetching object from S3:', error);
        throw error;
      }
    }
    async extractGeoTag(fileKey: string): Promise<{ latitude: number; longitude: number } | null> {
      try {
        const fileBuffer = await this.getObjectFromS3(process.env.S3_BUCKET_NAME!, fileKey);
        const parser = exifParser.create(fileBuffer);
        const exifData = parser.parse();
        function convertGPSCoordinates(degrees: number[], ref: string): number {
          const [deg, min, sec] = degrees;
          const decimal = deg + min / 60 + sec / 3600;
          return ref === 'S' || ref === 'W' ? -decimal : decimal;
        }
    
        if (exifData.tags.GPSLatitude && exifData.tags.GPSLongitude) {
          const latitude = convertGPSCoordinates(exifData.tags.GPSLatitude, exifData.tags.GPSLatitudeRef);
          const longitude = convertGPSCoordinates(exifData.tags.GPSLongitude, exifData.tags.GPSLongitudeRef);
    
          return {
            latitude,
            longitude,
          };
        }
    
        console.log('No geotagging found in the image.');
        return null;
      } catch (error) {
        console.error('Error extracting EXIF geotag:', error);
        return null;
      }
    }


    async create(req: Request, res: Response) {
      try {
        const { title, location } = req.body;
        const imageUrl = (req.file as UploadedFile).location;
        const fileKey = (req.file as UploadedFile).key;
    
        let extractedLocation = await this.extractGeoTag(fileKey);
        let finalLocation = extractedLocation ? extractedLocation : JSON.parse(location);
        console.log('final Location',finalLocation)
    
        if (!title || !location || !imageUrl) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const recruiters = await this.recruiterService.getNearbyRecruiters(finalLocation.latitude,finalLocation.longitude);

    
        const newReport = await this.animalService.createAnimalReport({
          description: title,
          imageUrl,
          location:finalLocation,
          userId: req.user.id,
          recruiterId:recruiters
        });

        let address = await axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_KEY}&lat=${finalLocation.latitude}&lon=${finalLocation.longitude}&format=json`)
    
        const recruitersToAlert = await this.fcmService.findRecruitersToken(recruiters)
        await this.fcmService.sendPushNotification(recruitersToAlert,"rescue alert",`rescue alert from${address}`,'http://localhost:4200/profile')
        return res.status(201).json(createResponse(HttpStatus.OK, "reported successfully"));
      } catch (error) {
        console.error("Error creating animal report:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  async getAll(req: Request, res: Response) {
    try {
      const reports = await this.animalService.getAnimalReports();
      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const report = await this.animalService.getAnimalReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      return res.status(200).json(report);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  

 
}

export default  AnimalReportController;






