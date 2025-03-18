import { Request, Response } from "express";


export default interface IAnimalController{
   

    create(req: Request, res: Response): Promise<Response>;
    getAll(req: Request, res: Response): Promise<Response>;
    getById(req: Request, res: Response): Promise<Response>;
    updateAlert(req: Request, res: Response): Promise<Response>;
    fetchRescueAlertsForRecruiter(req: Request, res: Response): Promise<Response>;
    fetchRescueAppointment(req: Request, res: Response): Promise<Response>;
}