import { Types } from "mongoose";
import { IRecruiter } from "../../entities/IRecruiter.interface";
import { ServiceResponse } from "../../entities/service-response.interface";
import { RescueAlertDTO } from "../../dto/rescue-alert.dto";



export interface IRecruiterService {
    register(recruiterData: Partial<IRecruiter>): Promise<{ status: number; message: string; data?: IRecruiter }>;
    login(email: string, password: string): Promise<ServiceResponse<IRecruiter>>;
    getProfile(userId: number): Promise<IRecruiter>;
    resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }>;
    getNearbyRecruiters(latitude: number, longitude: number): Promise<IRecruiter[]>;
    findRecruitersByRadius(latitude: number, longitude: number, radiusInKm: number): Promise<IRecruiter[]>;
    fetchRescueAlertsForRecruiter(recruiterId: string): Promise<RescueAlertDTO[]>
  }
  