import bcrypt from 'bcryptjs';
import { generateJwtToken } from '../utilities/generateJwt';
import { IUser } from '../interfaces/types/IUser';
import { IAdminRepository } from '../interfaces/repositories/IAdminRepository';
import { IDoctor } from '../interfaces/types/IDocotor.interface';
import { IRecruiter } from '../interfaces/types/IRecruiter.interface';
import { IBaseRepository } from '../interfaces/repositories/IBaseRepository';
import sendEmail from '../utilities/mailsender.utility';

class AdminService {
  

  constructor(private adminRepository: IAdminRepository,private userBaseRepository:IBaseRepository<IUser>,private doctorBaseRepository:IBaseRepository<IDoctor>,private recruiterBaseRepository:IBaseRepository<IRecruiter>) {
  }

  async loginAdmin(email: string, password: string): Promise<{ status: number; message: string; accessToken?: string; refreshToken?: string }> {
    try {
      const admin = await this.userBaseRepository.findByEmail(email);

      if (!admin) {
        return { status: 404, message: 'Admin not found' };
      }

      if (!admin.is_admin) {
        return { status: 403, message: 'Access denied. Not an admin.' };
      }

      if (!admin.password) {
        throw new Error('Password is missing for this user.');
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return { status: 401, message: 'Invalid password' };
      }

      const accessToken = generateJwtToken(
        { id: admin._id, email: admin.email, role: 'admin' },
        'access',
        '2m'
      );

      const refreshToken = generateJwtToken(
        { id: admin._id, email: admin.email, role: 'admin' },
        'refresh',
        '14d'
      );

      return { status: 200, message: 'Login successful', accessToken,refreshToken };
    } catch (error) {
      console.error('Error during admin login:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.adminRepository.getUsers();
      return users;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw error;
    }
  }

  async getAllUnVerifiedDoctors():Promise<IDoctor[]>{
    const doctors = await this.adminRepository.getUnVerifiedDoctors()
    return doctors
  }
  async getAllUnVerifiedRecruiters():Promise<IRecruiter[]>{
    const recruiters = await this.adminRepository.getUnVerifiedRecruiters()
    return recruiters
  }


  async getAllDoctors(): Promise<IDoctor[]> {
    try {
      const doctors = await this.adminRepository.getDoctors();
      return doctors;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw error;
    }
  }
  async getAllRecruiters(): Promise<IRecruiter[]> {
    try {
      const recruiters = await this.adminRepository.getRecruiters();
      return recruiters;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw error;
    }
  }

  async BlockUser(userId: string, is_block: boolean): Promise<{ status: number; message: string; user?: IUser }> {
    try {
      const user = await this.adminRepository.blockUser(userId, is_block);
      if (!user) {
        return { status: 404, message: 'User not found' };
      }

      const action = is_block ? 'blocked' : 'unblocked';
      return { status: 200, message: `User successfully ${action}`, user };
    } catch (error) {
      console.error('Error toggling user block status:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async BlockDoctor(doctorId: string, is_block: boolean): Promise<{ status: number; message: string; doctor?: IDoctor }> {
    try {
      const doctor = await this.adminRepository.blockDoctor(doctorId, is_block);
      if (!doctor) {
        return { status: 404, message: 'User not found' };
      }

      const action = is_block ? 'blocked' : 'unblocked';
      return { status: 200, message: `doctor successfully ${action}`,doctor };
    } catch (error) {
      console.error('Error toggling doctor block status:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
  async BlockRecruiter(recruiterId: string, is_block: boolean): Promise<{ status: number; message: string; recruiter?: IRecruiter }> {
    try {
      const recruiter = await this.adminRepository.blockRecruiter(recruiterId, is_block);
      if (!recruiter) {
        return { status: 404, message: 'recruiter not found' };
      }

      const action = is_block ? 'blocked' : 'unblocked';
      return { status: 200, message: `recruiter successfully ${action}`, recruiter };
    } catch (error) {
      console.error('Error toggling recruiter block status:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async verifyDoctor(userId: number): Promise<{status:number,message:string}> {

    const isVerified = await this.adminRepository.verifyDoctor(userId);

    const user = await this.doctorBaseRepository.findById(userId)
    if(!user){
      return {status:404,message:'doctor not found'}
    }

    const resetToken = generateJwtToken({id:user._id,email:user?.email,role:'doctor'},'reset','10m')
    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: '🎉 Your PawAid Account is Verified!',
      html: verificationEmailTemplate(resetLink),
    });

    return {status:200, message: 'Doctor verified successfully. Email sent.' };
  }

  async verifyRecruiter(userId: number):Promise<{status:number,message:string}> {
    const isVerified = await this.adminRepository.verifyRecruiter(userId);

    const user = await this.recruiterBaseRepository.findById(userId)
    if(!user){
      return {status:404,message:'recruiter not found'}
    }
    const resetToken = generateJwtToken({id:user._id,email:user.email,role:'recruiter'},'reset','10m')
    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: '🎉 Your PawAid Account is Verified!',
      html: verificationEmailTemplate(resetLink), 
    });


    return {status:200, message: 'Doctor verified successfully. Email sent.' };  }

 
  
}

export default AdminService; 


const verificationEmailTemplate = (resetLink: string): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PawAid - Account Verified</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #fef7e0;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
              padding: 30px;
              text-align: center;
          }
          .logo {
              width: 150px;
              margin-bottom: 20px;
          }
          .header {
              font-size: 24px;
              font-weight: bold;
              color: #ff9800;
          }
          .message {
              font-size: 16px;
              color: #444;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 20px;
              background-color: #ff9800;
              color: #fff;
              text-decoration: none;
              font-size: 18px;
              border-radius: 6px;
              font-weight: bold;
              transition: 0.3s;
          }
          .button:hover {
              background-color: #e68900;
          }
          .footer {
              font-size: 12px;
              color: #777;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://pawaid.s3.ap-south-1.amazonaws.com/pawaid-assets/logo.png" alt="PawAid Logo" class="logo">
          <div class="header">🎉 Congratulations! Your Account is Verified</div>
          <div class="message">
              Your PawAid account has been successfully verified! You can now access all features and start helping stray animals in need.  
              To complete your setup, please reset your password by clicking the button below:
          </div>
          <a href="${resetLink}" class="button">set Your Password</a>
          <div class="footer">
              If you did not request this, please ignore this email.  
              <br>
              &copy; 2025 PawAid. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};