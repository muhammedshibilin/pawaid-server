import { IRecruiter } from "../../entities/IRecruiter.interface";

export interface IRecruiterRepository {
  createRecruiter(RecruiterData: Partial<IRecruiter>): Promise<IRecruiter>;
  updatePassword(id: string, hashedPassword: string): Promise<IRecruiter | null>;
  findRecruitersNearby(latitude: number, longitude: number, radius: number): Promise<IRecruiter[]>;
  updateRecruiterLocation(recruiterId: string, latitude: number, longitude: number): Promise<IRecruiter | null>

}