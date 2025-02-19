import { RescueAppointmentDTO } from "../../dto/rescue-appointment.dto";
import { IDoctor } from "../../entities/IDocotor.interface";
import { ServiceResponse } from "../../entities/service-response.interface";

export interface IDoctorService {
    getProfile(userId: number): Promise<IDoctor>;
    findDoctors():Promise<{status:number;message:string;doctors:IDoctor[]}>
    login(email: string, password: string): Promise<ServiceResponse<IDoctor>>;
    getNearbyDoctors(latitude: number, longitude: number): Promise<IDoctor[]>;
    fetchRescueAppointment(recruiterId:string): Promise<RescueAppointmentDTO[]>
    resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }>;
    findDoctorsByRadius(latitude: number, longitude: number, radiusInKm: number): Promise<IDoctor[]>
    register(doctorData: Partial<IDoctor>): Promise<{ status: number; message: string; data?: IDoctor }>;

    
  }
  