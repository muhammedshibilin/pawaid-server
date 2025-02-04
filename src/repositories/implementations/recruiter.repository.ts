import { IRecruiterRepository } from "../../interfaces/repositories/IRecruiterRepository";
import { IRecruiter } from "../../interfaces/types/IRecruiter.interface";
import Recruiter from "../../models/recruiter.model";

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
     
   
}
