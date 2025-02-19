import { IUser } from "../../entities/IUser";
import { ServiceResponse } from "../../entities/service-response.interface";

export interface IUserService {
    registerUser(userData: IUser): Promise<{ status: number; message: string; data?: IUser }>;
  
    getUserById(userId: string): Promise<IUser | null>;
  
    verifyUserOtp(userId: string, otp: string): Promise<{ 
      status: number; 
      message: string; 
      token?: string; 
      refreshToken?: string; 
    }>;
  
    resendOtp(userId: string): Promise<{ status: number; message: string }>;
  
    registerGoogleUser(user: { email: string; username: string }): Promise<{ 
      user: IUser; 
      accessToken: string; 
      refreshToken: string; 
    }>;
  
    verifyEmail(email: string): Promise<{ 
      user: IUser | null; 
      accessToken: string; 
      refreshToken: string; 
    }>;
  
    loginUser(email: string, password: string): Promise<ServiceResponse<IUser>>;
  
    requestPasswordReset(email: string): Promise<{ status: number; message: string }>;
  
    resetPassword(token: string, newPassword: string): Promise<{ status: number; message: string }>;
  
    getProfile(userId: string): Promise<IUser>;
  }
  