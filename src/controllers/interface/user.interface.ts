import { Request, Response } from "express";

export interface IUserController {
    register(req: Request, res: Response): Promise<Response>;
    registerGoogleUser(req: Request, res: Response): Promise<Response>;
    findUser(req: Request, res: Response): Promise<Response>;
    verifyEmail(req: Request, res: Response): Promise<Response>;
    verifyOtp(req: Request, res: Response): Promise<Response>;
    resendOtp(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    requestPasswordReset(req: Request, res: Response): Promise<Response>;
    resetPassword(req: Request, res: Response): Promise<Response>;
    getProfile(req: Request, res: Response): Promise<Response>;
}
