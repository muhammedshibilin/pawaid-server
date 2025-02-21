import { Request, Response } from "express";


export interface IAdminController{
    login(req: Request, res: Response): Promise<Response>;
    blockUser(req: Request, res: Response): Promise<Response>;
    blockDoctor(req: Request, res: Response): Promise<Response> ;
    blockRecruiter(req: Request, res: Response): Promise<Response>;
    getUsers(req: Request, res: Response): Promise<Response> 
    getDoctors(req: Request, res: Response): Promise<Response>
    getRecruiters(req: Request, res: Response): Promise<Response> 
    getUnverifiedDoctorsAndRecruiters(req: Request, res: Response):Promise<Response>
    verifyDoctor(req: Request, res: Response):Promise<Response>;
    verifyRecruiter(req: Request, res: Response):Promise<Response>
}