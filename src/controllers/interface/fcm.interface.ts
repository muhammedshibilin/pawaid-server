import { Request, Response } from "express";

export interface IFCMController {
    registerToken(req: Request, res: Response): Promise<Response>;
    removeToken(req: Request, res: Response): Promise<Response>;
}