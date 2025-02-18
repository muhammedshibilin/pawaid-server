import { IRecruiterAlertRepository } from "../interfaces/IRecruiterAlertRepository";
import { IRecruiterAlert } from "../../entities/IRecruiters-alert.interface";
import RecruiterAlert from "../../models/recruiters-alert.model";
import { ObjectId } from "mongoose";


export interface IRescueAlert {
  _id: ObjectId;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export class RecruiterAlertRepository implements IRecruiterAlertRepository {
    async createRecruiterAlert(alertData: Partial<IRecruiterAlert>): Promise<IRecruiterAlert> {
      return await RecruiterAlert.create(alertData);
    }
  
    async updateAlertStatus(alertId: string, status: "accepted"): Promise<IRecruiterAlert | null> {
      return await RecruiterAlert.findByIdAndUpdate(alertId, { status }, { new: true });
    }

    async getRescueAlertsByRecruiter(recruiterId: string): Promise<IRecruiterAlert[]> {
      return await RecruiterAlert.find({ 
          notifiedRecruiters: recruiterId, 
          status: "pending" 
        })
        .populate({
          path: "animalReportId",
          select: "location",
        })
        .exec();
    }
    
}