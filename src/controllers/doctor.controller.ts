import { Request, Response } from 'express';
import { DoctorService } from '../services/implementation/doctor.service';
import { HttpStatus } from "../enums/http-status.enum";
import { createResponse } from '../utilities/createResponse.utils';
import { UploadedFile } from '../entities/upload-file.interface';
import { setCookie } from '../utilities/cookie.util';
import { FCMService } from '../services/implementation/fcm.service';



export class DoctorController {


  constructor(private doctorService: DoctorService,private fcmService:FCMService) {
  
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const doctorData = { ...req.body, document:(req.file as UploadedFile).location,location: {
        type: "Point", 
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] 
      }}
      console.log(doctorData, "doctor dataa is here");
  
      const result = await this.doctorService.register(doctorData);
      const admins = await this.fcmService.findAdminsToken()
      console.log('tokens',admins)
      await this.fcmService.sendPushNotification(admins,"registration alert","new doctor registered",'http://localhost:4200/admin/profile')
      return res.status(result.status).json(createResponse(result.status, result.message, result.data));
    } catch (error: any) {
      return res.status(500).json(createResponse(HttpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  }
  
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const {status,message,accessToken,refreshToken} = await this.doctorService.login(email, password);
      console.log(status,message,accessToken,refreshToken)
      setCookie(res,'refreshToken',refreshToken!)
      return res.status(200).json(createResponse(HttpStatus.OK, message,accessToken));
    } catch (error: any) {
      return res.status(400).json(createResponse(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user.id; 
      const userProfile = await this.doctorService.getProfile(userId);
      return res.status(200).json({ status: 200, data: userProfile });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({ status: 404, message: error.message });
          }
          return res.status(500).json({ status: 500, message: "An unknown error occurred" });
    }
  }  

  async resetPassword(req: Request, res: Response):Promise<void>{
    console.log(req.body,"jaaooo")
    const { token, newPassword } = req.body;
    const response = await this.doctorService.resetPassword(token, newPassword);
      res.status(response.status).json(createResponse(HttpStatus.OK,'password reset successfull'));    
      }

}
