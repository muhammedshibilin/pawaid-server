import { Request, Response } from "express";
import { FCMService } from "../../services/implementation/fcm.service";
import { IFCMController } from "../interface/fcm.interface";

export default class FCMController implements IFCMController {
    constructor(private fcm:FCMService){}
  async registerToken(req: Request, res: Response):Promise<Response> {
    try {
      const {token } = req.body;
      console.log('req.body',req.body,req.user.id,req.user.role)
      if (!req.user.id || !token) return res.status(400).json({ message: "Missing userId or token" });

      const fcmToken = await this.fcm.registerToken(req.user.id, token,req.user.role);
      return res.status(200).json({ message: "Token registered successfully", fcmToken });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async removeToken(req: Request, res: Response) :Promise<Response>{
    try {
      await this.fcm.removeToken(req.user.id);
      return res.status(200).json({ message: "Token removed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

