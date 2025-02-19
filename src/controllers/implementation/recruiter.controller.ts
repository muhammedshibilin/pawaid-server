import { Request, Response } from 'express';
import { RecruiterService } from '../../services/implementation/recruiter.service';
import { UploadedFile } from '../../entities/upload-file.interface';
import { createResponse } from '../../utilities/createResponse.utils';
import { HttpStatus } from '../../enums/http-status.enum';
import { setCookie } from '../../utilities/cookie.util';
import { FCMService } from '../../services/implementation/fcm.service';

  
export class RecruiterController {


  constructor(private recruiterService: RecruiterService,private fcmService:FCMService) {
   
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const recruiterData = { ...req.body, document:(req.file as UploadedFile).location,location: {
        type: "Point", 
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] 
      }}
      console.log(recruiterData, "recruiter dataa is here");
  
      const result = await this.recruiterService.register(recruiterData);
      const admins = await this.fcmService.findAdminsToken()
      console.log('tokens',admins)
      await this.fcmService.sendPushNotification(admins.data,"registration alert","new recruiter registered",'http://localhost:4200/admin/profile')
      return res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  

  async login(req: Request, res: Response): Promise<Response> {
    console.log('haii lgin recruiter contorller',req.body)
    try {
      const { email, password } = req.body;
      const {status,message,accessToken,refreshToken} = await this.recruiterService.login(email, password);
      setCookie(res,'refreshToken',refreshToken!)
      return res.status(200).json(createResponse(HttpStatus.OK,message,accessToken));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user.id; 
      const userProfile = await this.recruiterService.getProfile(userId);
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
          const response = await this.recruiterService.resetPassword(token, newPassword);
            res.status(response.status).json(createResponse(HttpStatus.OK,'password reset successfull'));    
    }

    

}
