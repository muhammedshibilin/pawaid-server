import { Request, Response } from "express";
import { FCMService } from "../services/fcm.service";

export default class FCMController {
    constructor(private fcm:FCMService){}
  async registerToken(req: Request, res: Response) {
    try {
      const {token } = req.body;
      console.log('req.body',req.body,req.user.id,req.user.role)
      if (!req.user.id || !token) return res.status(400).json({ message: "Missing userId or token" });

      const fcmToken = await this.fcm.registerToken(req.user.id, token,req.user.role);
      res.status(200).json({ message: "Token registered successfully", fcmToken });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async removeToken(req: Request, res: Response) {
    try {
      await this.fcm.removeToken(req.user.id);
      res.status(200).json({ message: "Token removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

