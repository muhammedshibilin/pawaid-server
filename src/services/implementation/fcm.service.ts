import { Types } from "mongoose";
import { IFCMService } from "../interface/IFcmService.interface";
import { IFcmRepository } from "../../repositories/interfaces/IFcmRepository";
import admin from "../../config/firebase-admin.config";

export class FCMService implements IFCMService {
  constructor(private fcm: IFcmRepository) {}

  async registerToken(userId: string, token: string, role: string): Promise<{ status: number; message: string }> {
    await this.fcm.saveOrUpdateToken(userId, token, role);
    return { status: 200, message: "Token registered successfully" };
  }

  async removeToken(userId: string): Promise<{ status: number; message: string }> {
    await this.fcm.deleteToken(userId);
    return { status: 200, message: "Token removed successfully" };
  }

  async cleanupTokens(): Promise<{ status: number; message: string }> {
    await this.fcm.cleanupOldTokens(30);
    return { status: 200, message: "Old tokens cleaned up successfully" };
  }

  async findAdminsToken(): Promise<{ status: number; message: string; data: string[] }> {
    const adminTokens = await this.fcm.getAdminTokens();
    return { status: 200, message: "Admin tokens retrieved successfully", data: adminTokens };
  }

  async findRecruitersToken(id: Types.ObjectId[]| Types.ObjectId): Promise<{ status: number; message: string; data: string[] }> {
    const tokens = await this.fcm.getRecruitersTokensByIds(id);
    return { status: 200, message: "Recruiter tokens retrieved successfully", data: tokens };
  }

  async findDoctorsToken(id: Types.ObjectId[]|Types.ObjectId): Promise<{ status: number; message: string; data: string[] }> {
    const tokens = await this.fcm.getDoctorsTokensByIds(id);
    return { status: 200, message: "Doctors tokens retrieved successfully", data: tokens };
  }

  async sendPushNotification(
    fcmTokens: string[],
    title: string,
    body: string,
    redirectUrl: string
  ): Promise<{ status: number; message: string }> {
    if (fcmTokens.length === 0) {
      return { status: 400, message: "No valid FCM tokens found." };
    }

    const payload = {
      notification: { title, body },
      data: { redirectUrl },
      tokens: fcmTokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(payload);
      console.log('response from notification message sending',response)
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          console.error(`Error sending to ${fcmTokens[index]}:`, resp.error);
        }
      });

      return { status: 200, message: "Notifications sent successfully" };
    } catch (error) {
      console.error("Error sending notifications:", error);
      return { status: 500, message: "Failed to send notifications" };
    }
  }
}
