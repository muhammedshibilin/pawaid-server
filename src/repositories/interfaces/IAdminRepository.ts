import { IDoctor } from "../../entities/IDocotor.interface";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import { IUser } from "../../entities/IUser";

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
