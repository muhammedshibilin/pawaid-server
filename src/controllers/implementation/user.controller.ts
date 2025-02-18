import { Request, Response } from "express";
import { IUser } from '../../entities/IUser';
import { createResponse } from '../../utilities/createResponse.utils';
import { HttpStatus } from '../../enums/http-status.enum';
import { setCookie } from '../../utilities/cookie.util';
import UserService from '../../services/implementation/user.service';



class UserController {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }
    
    async register(req: Request, res: Response): Promise<Response> {
        const { username, email, password, phone } = req.body;
        console.log("Controller received data:", req.body); 
    
        try {
            console.log("Calling service...",this.userService)
            const serviceResponse = await this.userService.registerUser({
                username,
                email,
                password,
                phone,
            } as IUser);
    
            console.log("Service response:", serviceResponse);
    
            if (serviceResponse.status === HttpStatus.BAD_REQUEST) {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    createResponse(serviceResponse.status, serviceResponse.message)
                );
            }
    
            return res
                .status(HttpStatus.OK)
                .json(
                    createResponse(
                        serviceResponse.status,
                        serviceResponse.message,
                        serviceResponse.data
                    )
                );
        } catch (error) {
            console.error("Error in controller:", error);
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    createResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "An error occurred while registering the user",
                    )
                );
        }
    }

    async registerGoogleUser(req: Request, res: Response): Promise<Response> {
      try {
        const { email, username } = req.body;
      console.log("google user data",req.body)
        if (!email || !username) {
          return res.status(400).json({
            status: 400,
            message: 'Email and username are required',
            error: null,
            data: null
          });
        }
    
        const { user, accessToken, refreshToken } = await this.userService.registerGoogleUser({
          email,
          username,
        });
        setCookie(res, 'refreshToken', refreshToken);
    
        return res.status(201).json({
          status: 201,
          message: 'Register successful',
          error: null,
          data: {
            user: true,
            accessToken,
            refreshToken,
            userData: {
              email: user.email,
              username: user.username,
              _id: user._id
            }
          }
        });
      } catch (error) {
        console.error('Error registering Google user:', error);
        return res.status(500).json({
          status: 500,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
          data: null
        });
      }
    }

    async findUser(req: Request, res: Response): Promise<Response> {
      try {
        console.log('Find user endpoint hit');
        console.log('Request body:', req.body);

        const { userId } = req.body;

        if (!userId) {
          console.log('No userId provided');
          return res.status(400).json({ 
            status: 400,
            message: 'User ID is required',
            error: true 
          });
        }

        console.log('Looking up user with ID:', userId);
        const user = await this.userService.getUserById(userId);

        if (!user) {
          console.log('No user found with ID:', userId);
          return res.status(404).json({ 
            status: 404,
            message: 'User not found',
            error: true 
          });
        }

        console.log('User found:', user);
        
        if (user.is_block) {
          console.log('User is blocked:', userId);
          return res.status(403).json({ 
            status: 403,
            message: 'User is blocked',
            error: true,
            user 
          });
        }

        return res.status(200).json({ 
          status: 200,
          message: 'User is active',
          error: false,
          user 
        });

      } catch (error) {
        console.error('Error in findUser:', error);
        return res.status(500).json({ 
          status: 500,
          message: 'Internal server error',
          error: true,
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    async verifyEmail(req: Request, res: Response): Promise<Response> {
      try {
        const { email } = req.body;

        if (!email) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: 'Email is required',
            error: null,
            data: null
          });
        }

        const { user, accessToken, refreshToken } = await this.userService.verifyEmail(email);

        if (!user) {
          return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            message: 'User not found',
            error: null,
            data: null
          });
        }

        setCookie(res, 'refreshToken', refreshToken);

        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          message: 'User verified successfully',
          error: null,
          data: {
            user: true,
            accessToken,
            refreshToken,
            userData: {
              email: user.email,
              username: user.username,
              _id: user._id
            }
          }
        });
      } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
          data: null
        });
      }
    }
  
    
    

    async verifyOtp(req: Request, res: Response): Promise<Response> {
        const { userId, otp } = req.body; 
        console.log('verify otp yil ethii',req.body)
        try {
          const {status,message,token,refreshToken} = await this.userService.verifyUserOtp(userId, otp);
          console.log('dataaaas from service',status,message,token,refreshToken)
          if(status==HttpStatus.OK){
            setCookie(res,'refreshToken',refreshToken!)
            return res.status(HttpStatus.OK).json(createResponse(HttpStatus.OK,message,token));
          }else{
            return res.status(status).json(createResponse(status,message))
          }
        } catch (error) {
          return res.status(500).json({ message:'an error occurred while verifying otp'});
        }
    }

    async resendOtp(req:Request,res:Response):Promise<Response>{
       const {userId} = req.body
       console.log("in resend controller",req.body)
       try {
        const response = await this.userService.resendOtp(userId)
        return res.status(response.status).json({message:response.message})
       } catch (error) {
        return res.status(500).json({message:'and error occured while verfying otp'})
       }
    }

    async login(req:Request,res:Response):Promise<Response>{
        const {email,password} = req.body
        console.log("haiii aheeloo loginil ethiiiii",req.body)
        try {
            const {status,message,accessToken,refreshToken} = await this.userService.loginUser(email,password)
            if (status === 200) {
                  setCookie(res,'refreshToken', refreshToken!);
                  return res.status(status).json(createResponse(status,message,accessToken));
            }
            return res.status(status).json({status,message});
        } catch (error) {
            return res.status(500).json({status:500, message: 'An error occurred while logging in' });
        }
    }

    async requestPasswordReset(req:Request,res:Response):Promise<Response>{
    const { email} = req.body;
    const response = await this.userService.requestPasswordReset(email);
    return res.status(response.status).json({ message: response.message });
    }

    async resetPassword(req: Request, res: Response):Promise<void>{
        console.log(req.body,"jaaooo")
        const { token, newPassword } = req.body;
        const response = await this.userService.resetPassword(token, newPassword);
          res.status(response.status).json(createResponse(HttpStatus.OK,'password reset successfull'));    
          }

      async getProfile(req: Request, res: Response): Promise<Response> {
        try {
          const userId = req.user.id; 
          const userProfile = await this.userService.getProfile(userId);
          return res.status(200).json({ status: 200, data: userProfile });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ status: 404, message: error.message });
              }
              return res.status(500).json({ status: 500, message: "An unknown error occurred" });
        }
      }  

    
    
      }




export default UserController