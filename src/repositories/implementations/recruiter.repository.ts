import { IRecruiterRepository } from "../interfaces/IRecruiterRepository";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import Recruiter from "../../models/recruiter.model";
import { createClient } from "redis";


const redisClient = createClient()
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
    async findRecruitersNearby(latitude: number, longitude: number, radius: number): Promise<IRecruiter[]> {
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
          
              return recruiters;
        } catch (error) {
            console.error("❌ Error finding nearby recruiters:", error);
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

   
}
