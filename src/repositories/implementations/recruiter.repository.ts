import { IRecruiterRepository } from "../interfaces/IRecruiterRepository";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import Recruiter from "../../models/recruiter.model";
import { createClient } from "redis";
import { Types } from "mongoose";
import AnimalReport from "../../models/animal-report.model";


export class RecruiterRepository implements IRecruiterRepository {
    async createRecruiter(RecruiterData: Partial<IRecruiter>): Promise<IRecruiter> {
        console.log('creating recruiter',RecruiterData)
        const recruiter = new Recruiter(RecruiterData);
        console.log('created recruiter',recruiter)
        return recruiter.save();
      }
      async updatePassword(id: string, hashedPassword: string): Promise<IRecruiter | null> {
        return await Recruiter.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
    }
  

    async findRecruitersNearby(latitude: number, longitude: number, radius: number): Promise<Types.ObjectId[]> {
      try {
        const recruiters = await Recruiter.find({
          location: {
            $geoWithin: {
              $centerSphere: [
                [longitude, latitude],
                radius / 6378.1
              ]
            }
          }
        })
        .select('_id')
        .lean()
        .exec();
  
        return recruiters.map(recruiter => new Types.ObjectId(recruiter._id.toString()));
      } catch (error) {
        console.error("Error finding nearby recruiters:", error);
        return [];
      }
  }
  
  

async updateRecruiterLocation(recruiterId: string, latitude: number, longitude: number): Promise<IRecruiter | null> {
    try {
      return await Recruiter.findByIdAndUpdate(
        recruiterId,
        {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          }
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating recruiter location:', error);
      return null;
    }
  }



  async updateAvailability(recruiterId: string): Promise<boolean> {
      try {
          const recruiter = await Recruiter.findOne({ recruiterId }); 
          if (!recruiter) {
              console.log("Recruiter not found");
              return false; 
          }
  
          const updatedAvailability = !recruiter.is_available;
  
          const updatedRecruiter = await AnimalReport.findByIdAndUpdate(
              recruiter._id, 
              { availability: updatedAvailability },
              { new: true } 
          );
  
          return updatedRecruiter ? true : false;
      } catch (error) {
          console.error("Error updating recruiter availability:", error);
          return false; 
      }
  }
  
   
}
