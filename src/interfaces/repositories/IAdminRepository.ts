import { IDoctor } from "../types/IDocotor.interface";
import { IRecruiter } from "../types/IRecruiter.interface";
import { IUser } from "../types/IUser";

export interface IAdminRepository {
  getUsers(): Promise<IUser[]>;
  getDoctors(): Promise<IDoctor[]>;
  getRecruiters(): Promise<IRecruiter[]>;
  blockUser(userId: string, is_block: boolean): Promise<IUser | null>;
  blockDoctor(doctorId: string, is_block: boolean): Promise<IDoctor | null>;
  blockRecruiter(recruiterId: string, is_block: boolean): Promise<IRecruiter| null>;
  getUnVerifiedDoctors():Promise<IDoctor[]>;
  getUnVerifiedRecruiters():Promise<IRecruiter[]>;
  verifyDoctor(userId:number):Promise<IDoctor|null>;
  verifyRecruiter(userId:number):Promise<IRecruiter|null>;
}
