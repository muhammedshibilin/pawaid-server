import { Request, Response } from "express";
import { createResponse } from "../../utilities/createResponse.utils";
import { HttpStatus } from "../../enums/http-status.enum";
import { UploadedFile } from "../../entities/upload-file.interface";
import { FCMService } from "../../services/implementation/fcm.service";
import exifParser from 'exif-parser';
import s3Client from "../../config/s3.cofig";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { sdkStreamMixin } from "@aws-sdk/util-stream-node";
import { Readable } from "stream";
import axios from 'axios'
import { IDoctorService } from "../../services/interface/IDoctorService.interface";
import { IRecruiterService } from "../../services/interface/IRecruiterService.interface";
import { IAnimalReportService } from "../../services/interface/IAnimalReportService.interface";
import { Types } from "mongoose";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import { IDoctor } from "../../entities/IDocotor.interface";
import { AnimalStatus } from "../../enums/animal-status.enum";

export default class AnimalReportController {

    constructor(private animalService:IAnimalReportService,
      private fcmService:FCMService,
      private recruiterService:IRecruiterService,
      private doctorService:IDoctorService
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

        const recruiters: IRecruiter[] = await this.recruiterService.getNearbyRecruiters(finalLocation.latitude,finalLocation.longitude);

        const recruiterIds: Types.ObjectId[] = recruiters.map((recruiter) => new Types.ObjectId(recruiter._id as Types.ObjectId));

    
        const newReport = await this.animalService.createAnimalReport({
          description: title,
          imageUrl,
          location:finalLocation,
          userId: req.user.id,
          recruiterId:recruiterIds
        });

        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_KEY}&lat=${finalLocation.latitude}&lon=${finalLocation.longitude}&format=json`
        );
        
        const fullAddress = response.data.display_name; 
        const addressParts = fullAddress.split(',').slice(0, 3).join(',');
        
        const recruitersToAlert = await this.fcmService.findRecruitersToken(recruiterIds)
        await this.fcmService.sendPushNotification(recruitersToAlert.data,"rescue alert",`rescue alert from  ${addressParts}`,'http://localhost:4200/profile')
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


  async updateAlert(req: Request, res: Response):Promise<Response> {
    try{

    const { animalReportId, recruiterId, status, location } = req.body;

    const animalReport = await this.animalService.updateAlert(animalReportId, recruiterId, status)
    if (!animalReport) {
        return res.status(404).json({ success: false, message: 'Animal report not found' });
    }

      let doctors:IDoctor[] = []

    if(animalReport.status === AnimalStatus.PICKED){
      doctors = await this.doctorService.getNearbyDoctors(location.latitude,location.longitude);
      const doctorsIds: Types.ObjectId[] = doctors.map((recruiter) => new Types.ObjectId(recruiter._id as Types.ObjectId));
      await this.animalService.updateDoctors(animalReportId,doctorsIds)
      return res.status(200).json({ status:200, message: 'animal picked successfully',data: animalReport ,doctors:doctors });

    }


    return res.status(200).json({ status:200, message: 'Rescue accepted successfully',data: animalReport });
    }catch(error) {
    console.log('Error updating alert:', error);
    return res.status(500).json({ success: false, message: 'Failed to update alert' });
}
}

async fetchRescueAlertsForRecruiter(req: Request, res: Response): Promise<Response> {
  try {
      const recruiterId = req.params.recruiterId;

      if (!recruiterId) {
          return res.status(400).json({ success: false, message: "Recruiter ID is required" });
      }

      const responseData = await this.recruiterService.fetchRescueAlertsForRecruiter(recruiterId);
      return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
      console.error("Error fetching rescue alerts:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch rescue alerts" });
  }
}

async fetchRescueAppointment(req:Request,res:Response):Promise<Response>{
  const doctorId = req.params.doctorId;
  if (!doctorId) {
    return res.status(400).json({ success: false, message: "Recruiter ID is required" });
}

const responseData = await this.doctorService.fetchRescueAppointment(doctorId);
return res.status(200).json({ success: true, data: responseData });
}
  

}







