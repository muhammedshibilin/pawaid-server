import { IDoctorRepository } from "../interfaces/repositories/IDoctorRepository";
import bcrypt from 'bcryptjs';
import { IDoctor } from "../interfaces/types/IDocotor.interface";
import { IBaseRepository } from "../interfaces/repositories/IBaseRepository";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServiceResponse } from "../interfaces/types/service-response.interface";
import { generateJwtToken } from "../utilities/generateJwt";

export class DoctorService {
    constructor(private doctorRepository: IDoctorRepository,private baseRepository:IBaseRepository<IDoctor>) {}

    async register(doctorData: Partial<IDoctor>): Promise<{ status: number; message: string; data?: IDoctor }> {
        if (!doctorData.email) {
            return { status: 400, message: 'Email is required!' };
        }

        const existingDoctor = await this.baseRepository.findByEmail(doctorData.email);
        if (existingDoctor) {
            return { status: 409, message: 'Email already registered!' };
        }
        doctorData.is_verified = false;
        doctorData.password = null

        const doctor = await this.doctorRepository.createDoctor(doctorData);
        return { status: 200, message: 'Doctor registered successfully', data: doctor };
    }

    async login(email: string, password: string): Promise<ServiceResponse<IDoctor>> {
        const doctor = await this.baseRepository.findByEmail(email);
        if (!doctor) {
            return {status:404,message:'doctor not found'}
        }

        if (!doctor.is_verified) {
          return {status:404,message:'you are not verfied'}
      }

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
}
