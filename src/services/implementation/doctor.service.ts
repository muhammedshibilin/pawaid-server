import { IDoctorRepository } from "../../repositories/interfaces/IDoctorRepository";
import bcrypt from 'bcryptjs';
import { IDoctor } from "../../entities/IDocotor.interface";
import { IBaseRepository } from "../../repositories/interfaces/IBaseRepository";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServiceResponse } from "../../entities/service-response.interface";
import { generateJwtToken } from "../../utilities/generateJwt";
import { IDoctorService } from "../interface/IDoctorService.interface";
import { RescueAppointmentDTO } from "../../dto/rescue-appointment.dto";
import { IAnimalReportRepository } from "../../repositories/interfaces/IAnimalRepository";



export class DoctorService implements IDoctorService{
    constructor(private doctorRepository: IDoctorRepository,
      private baseRepository:IBaseRepository<IDoctor>,
    private animalRepository:IAnimalReportRepository) {}

    async register(doctorData: Partial<IDoctor>): Promise<{ status: number; message: string; data?: IDoctor }> {
        if (!doctorData.email) {
            return { status: 400, message: 'Email is required!' };
        }

        const existingDoctor = await this.baseRepository.findByEmail(doctorData.email);
        if (existingDoctor) {
            return { status: 409, message: 'Email already registered!' };
        }
        doctorData.is_verified = false;
        doctorData.password = await bcryptjs.hash('doctor123', 10)

        const doctor = await this.doctorRepository.createDoctor(doctorData);
        return { status: 200, message: 'Doctor registered successfully', data: doctor };
    }

    async login(email: string, password: string): Promise<ServiceResponse<IDoctor>> {
        const doctor = await this.baseRepository.findByEmail(email);
        if (!doctor) {
            return {status:404,message:'doctor not found'}
        }

      //   if (!doctor.is_verified) {
      //     return {status:404,message:'you are not verfied'}
      // }

        const isPasswordValid = await bcrypt.compare(password, doctor.password!);
        if (!isPasswordValid) {
          return {status:404,message:'password not match'}
        }

      

        const accessToken = generateJwtToken({id:doctor._id,email:doctor.email,role:'doctor'},'access','2m')
        const refreshToken = generateJwtToken({id:doctor._id,email:doctor.email,role:'doctor'},'refresh','14d')

        return {status:200,message:'login successfull',accessToken,refreshToken};
    }

    async getProfile(userId: number) {
      console.log("get profile service", userId)
      const doctor = await this.baseRepository.findById(userId);
      if (!doctor) {
        throw new Error("doctor not found");
      }
      return doctor;
    }

     async resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }> {
        try {
    
          console.log('reset token in rsetpasswrd',token)
          const decoded = jwt.verify(token, process.env.JWT_RESET!) as jwt.JwtPayload;
                const user = await this.baseRepository.findByEmail(decoded.email);
      
          if (!user) {
            return { status: 404, message: 'User not found' }; 
          }
          const hashedPassword = await bcryptjs.hash(newPassword, 10);
      
          await this.doctorRepository.updatePassword(user.id, hashedPassword);
      
          return { status: 200, message: 'Password reset successfully' };
        
        } catch (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            return { status: 400, message: 'Invalid token' };
          }
      
          if (error instanceof jwt.TokenExpiredError) {
            return { status: 400, message: 'Token expired' }; 
          }
      
          if (error instanceof Error && error.message.includes('database')) {
            return { status: 500, message: 'Database error, please try again later' }; 
          }
      
          console.error('Error resetting password:', error);
          return { status: 500, message: 'Internal server error, please try again later' }; 
        }
      }

       async getNearbyDoctors(latitude: number, longitude: number): Promise<IDoctor[]> {
          let radius = 5;
          let doctors:IDoctor[] = [];
          
          while (doctors.length === 0 && radius <= 100) {
            doctors = await this.findDoctorsByRadius(latitude, longitude, radius);
            if (doctors.length === 0) radius += 5;
          }
      
          return doctors;
      }
      
        async findDoctorsByRadius(latitude: number, longitude: number, radiusInKm: number): Promise<IDoctor[]> {
          return this.baseRepository.findNearby(latitude, longitude, radiusInKm);
      }


      async fetchRescueAppointment(recruiterId:string): Promise<RescueAppointmentDTO[]> {
        const alerts = await this.animalRepository.getRescueAppointment(recruiterId);
        console.log("Rescue alerts:", alerts);
      
        if (!alerts || alerts.length === 0) return [];
      
        return alerts.map(alert => ({
          id: alert._id,
          description: alert.description,
          status: alert.status,
          date: alert.createdAt ? new Date(alert.createdAt) : new Date()
      }));
      }


      async findDoctors():Promise<{status:number;message:string;doctors:IDoctor[]}>{
        const doctors = await this.doctorRepository.findDoctors()
        return {status:200,message:'doctor fetched successfully',doctors:doctors}
      }
}
