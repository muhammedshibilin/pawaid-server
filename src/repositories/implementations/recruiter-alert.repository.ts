import { IRecruiterAlertRepository } from "../interfaces/IRecruiterAlertRepository";
import { ObjectId } from "mongoose";
import AnimalReport from "../../models/animal-report.model";
import { IAnimalReport } from "../../entities/animal-report.interface";


export interface IRescueAlert {
  _id: ObjectId;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export class RecruiterAlertRepository implements IRecruiterAlertRepository {

    async updateAlertStatus(alertId: string, status: "accepted"): Promise<IAnimalReport| null> {
      return await AnimalReport.findByIdAndUpdate(alertId, { status }, { new: true });
    }

    

    async getRescueAlertsByRecruiter(recruiterId: string): Promise<IAnimalReport[]> {
      return await AnimalReport.find({ 
        recruiterId: recruiterId, 
        })
    }
    
}