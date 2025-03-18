import { Request, Response } from "express";

export default interface IDoctorController{
    register(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    getProfile(req: Request, res: Response): Promise<Response>;
    resetPassword(req: Request, res: Response): Promise<void>;
    getNearbyDoctors(req: Request, res: Response): Promise<Response>;
}