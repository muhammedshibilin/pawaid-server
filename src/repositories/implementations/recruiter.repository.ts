import { IRecruiterRepository } from "../interfaces/IRecruiterRepository";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import Recruiter from "../../models/recruiter.model";
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
        console.log('recruiterId',recruiterId)
          const recruiter = await Recruiter.findById({ _id:recruiterId });
          console.log('recruiter find',recruiter)
          if (!recruiter) {
              console.log("Recruiter not found");
              return false; 
          }
  
          const updatedAvailability = !recruiter.is_available;

          console.log('recrutier availability',updatedAvailability)
  
          const updatedRecruiter = await Recruiter.findByIdAndUpdate(
              recruiter._id, 
              {is_available: updatedAvailability },
              { new: true } 
          );

          console.log('updated recruiter',updatedRecruiter)
  
          return updatedRecruiter ? true : false;
      } catch (error) {
          console.error("Error updating recruiter availability:", error);
          return false; 
      }
  }
  
   
}
