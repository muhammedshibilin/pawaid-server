import { IDoctor } from "../../entities/IDocotor.interface";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import { IUser } from "../../entities/IUser";


export interface IAdminService {
  loginAdmin(email: string, password: string): Promise<{ 
    status: number; 
    message: string; 
    accessToken?: string; 
    refreshToken?: string; 
  }>;

  getAllUsers(): Promise<IUser[]>;
  getAllDoctors(): Promise<IDoctor[]>;
  getAllRecruiters(): Promise<IRecruiter[]>;
  getAllUnVerifiedDoctors(): Promise<IDoctor[]>;
  getAllUnVerifiedRecruiters(): Promise<IRecruiter[]>;

  BlockUser(userId: string, is_block: boolean): Promise<{ 
    status: number; 
    message: string; 
    user?: IUser; 
  }>;

  BlockDoctor(doctorId: string, is_block: boolean): Promise<{ 
    status: number; 
    message: string; 
    doctor?: IDoctor; 
  }>;

  BlockRecruiter(recruiterId: string, is_block: boolean): Promise<{ 
    status: number; 
    message: string; 
    recruiter?: IRecruiter; 
  }>;

  verifyDoctor(userId: number): Promise<{ status: number; message: string }>;
  verifyRecruiter(userId: number): Promise<{ status: number; message: string }>;
}
