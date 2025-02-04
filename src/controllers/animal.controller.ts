import { Request, Response } from "express";
import AnimalReportService from "../services/animal.service";
import { createResponse } from "../utilities/createResponse.utils";
import { HttpStatus } from "../enums/http-status.enum";
import { UploadedFile } from "../interfaces/types/upload-file.interface";
import { FCMService } from "../services/fcm.service";

class AnimalReportController {

    constructor(private animalService:AnimalReportService,private fcmService:FCMService){}
  async create(req: Request, res: Response) {
    try {
      const { title, location } = req.body;
      console.log("controllerr ill animal report",req.body,req.file)
      const imageUrl = (req.file as UploadedFile).location; 

      if (!title || !location || !imageUrl) {
        console.log('haii endoo kuravind',title,location,imageUrl)
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newReport = await this.animalService.createAnimalReport({
        description:title,
        imageUrl,
        location: JSON.parse(location),
        userId: req.userId, 
      });

      return res.status(201).json(createResponse(HttpStatus.OK,"reported successfully"));
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

  async getAnimalReport(){
    try {
        
    } catch (error) {
        
    }
  }
}

export default  AnimalReportController;
