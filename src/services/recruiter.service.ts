import { IRecruiterRepository } from "../interfaces/repositories/IRecruiterRepository";
import bcrypt from 'bcryptjs';
import { IRecruiter } from "../interfaces/types/IRecruiter.interface";
import { IBaseRepository } from "../interfaces/repositories/IBaseRepository";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServiceResponse } from "../interfaces/types/service-response.interface";
import { generateJwtToken } from "../utilities/generateJwt";

export class RecruiterService {
  constructor(private recruiterRepository: IRecruiterRepository, private baseRepository: IBaseRepository<IRecruiter>) { }

  async register(recruiterData: Partial<IRecruiter>): Promise<{ status: number; message: string; data?: IRecruiter }> {
    if (!recruiterData.email) {
      return { status: 400, message: 'Email is required!' };
    }

    const existingRecruiter = await this.baseRepository.findByEmail(recruiterData.email);
    if (existingRecruiter) {
      return { status: 409, message: 'Email already registered!' };
    }
    recruiterData.is_verified = false;
    recruiterData.password = null

    console.log('recruiter data is service', recruiterData)
    const recruiter = await this.recruiterRepository.createRecruiter(recruiterData);
    return { status: 200, message: 'recruiter registered successfully', data: recruiter };
  }

  async login(email: string, password: string): Promise<ServiceResponse<IRecruiter>> {
    console.log('haii recruiter servicicil in ', email, password)
    const recruiter = await this.baseRepository.findByEmail(email);
    console.log('recretuire find in service', recruiter)
    if (!recruiter) {
      return { status: 404, message: 'recuiter not found' }
    }

    if (recruiter.is_verified == false) {
      console.log('not verified')
      return { status: 404, message: 'recruiter is not verified by admin' }
    }

    const isPasswordValid = await bcrypt.compare(password, recruiter.password!);
    if (!isPasswordValid) {
      console.log('password not math')
      return { status: 404, message: 'incorrect password' }
    }

   

    const accessToken = generateJwtToken({ id: recruiter._id, email: recruiter.email, role: 'recruiter' }, 'access', '2m')
    const refreshToken = generateJwtToken({ id: recruiter._id, email: recruiter.email, role: 'recruiter' }, 'refresh', '14d')

    return { status: 200, message: 'Login successful', accessToken, refreshToken }
  }

  async getProfile(userId: number) {
    console.log("get profile service", userId)
    const recruiter = await this.baseRepository.findById(userId);
    if (!recruiter) {
      throw new Error("recruiter not found");
    }
    return recruiter;
  }

  async resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }> {
    try {

      console.log('reset token in rsetpasswrd', token)
      const decoded = jwt.verify(token, process.env.JWT_RESET!) as jwt.JwtPayload;
      const user = await this.baseRepository.findByEmail(decoded.email);

      if (!user) {
        return { status: 404, message: 'User not found' };
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);

      await this.recruiterRepository.updatePassword(user.id, hashedPassword);

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
