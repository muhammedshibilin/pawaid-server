import { Request, Response } from "express";
import { createResponse } from "../../utilities/createResponse.utils";
import { HttpStatus } from "../../enums/http-status.enum";
import { UploadedFile } from "../../entities/upload-file.interface";
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
import { IFCMService } from "../../services/interface/IFcmService.interface";
import IAnimalController from "../interface/animal.interface";

export default class AnimalReportController implements IAnimalController {

    constructor(private animalService:IAnimalReportService,
      private fcmService:IFCMService,
      private recruiterService:IRecruiterService,
      private doctorService:IDoctorService
    ){}




    async create(req: Request, res: Response) {
      try {
        const { title, location } = req.body;
        const imageUrl = req.body.imageUrl; // Get the image URL from the request body
    
        // Validate required fields
        if (!title || !location || !imageUrl) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        // Parse the location sent from the frontend
        let finalLocation;
        try {
          finalLocation = JSON.parse(location);
        } catch (error) {
          console.error('Error parsing location:', error);
          return res.status(400).json({ message: "Invalid location format" });
        }
    
        // Fetch nearby recruiters based on the location
        const recruiters: IRecruiter[] = await this.recruiterService.getNearbyRecruiters(
          finalLocation.latitude,
          finalLocation.longitude
        );
    
        // Extract recruiter IDs
        const recruiterIds: Types.ObjectId[] = recruiters.map(
          (recruiter) => new Types.ObjectId(recruiter._id as Types.ObjectId)
        );
    
        // Create the animal report
        const newReport = await this.animalService.createAnimalReport({
          description: title,
          imageUrl, // Use the image URL sent from the frontend
          location: finalLocation, // Use the location sent from the frontend
          userId: req.user.id,
          recruiterId: recruiterIds,
        });
    
        // Reverse geocode to get the address
        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_KEY}&lat=${finalLocation.latitude}&lon=${finalLocation.longitude}&format=json`
        );
        const fullAddress = response.data.display_name;
        const addressParts = fullAddress.split(',').slice(0, 3).join(',');
    
        // Send push notifications to recruiters
        const recruitersToAlert = await this.fcmService.findRecruitersToken(recruiterIds);
        console.log('Recruiters to alert:', recruitersToAlert);
        await this.fcmService.sendPushNotification(
          recruitersToAlert.data,
          "Rescue Alert",
          `Rescue alert from ${addressParts}`,
          'http://localhost:4200/profile'
        );
    
        return res.status(201).json(createResponse(HttpStatus.OK, "Reported successfully"));
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

    const { animalReportId,status, recruiterId,doctorId,location } = req.body;

    const animalReport = await this.animalService.updateAlert(animalReportId,status, recruiterId,doctorId)
    if (!animalReport) {
        return res.status(404).json({ success: false, message: 'Animal report not found' });
    }

      let doctors:IDoctor[] = []

    if(animalReport.status === AnimalStatus.PICKED){
      doctors = await this.doctorService.getNearbyDoctors(location.latitude,location.longitude);
      const doctorsIds: Types.ObjectId[] = doctors.map((recruiter) => new Types.ObjectId(recruiter._id as Types.ObjectId));
      await this.animalService.updateDoctors(animalReportId,doctorsIds)
      const doctorsToAlert = await this.fcmService.findDoctorsToken(doctorsIds)
      await this.fcmService.sendPushNotification(doctorsToAlert.data,"rescue alert",'new rescue appointment','http://localhost:4200/profile')
      return res.status(200).json({ status:200, message: 'animal picked successfully',data: animalReport ,doctors:doctors });

    }

    if(animalReport.status===AnimalStatus.BOOKED){
      if (animalReport.recruiterId) {
        const recruiterToAlert = await this.fcmService.findRecruitersToken(animalReport.recruiterId)
        await this.fcmService.sendPushNotification(recruiterToAlert.data," booking accepted",'new rescue appointment accepted','http://localhost:4200/profile')

      }
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







