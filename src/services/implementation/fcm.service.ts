import { Types } from "mongoose";
import admin from "../../config/firebase-admin.config";
import { IFcmRepository } from "../../repositories/interfaces/IFcmRepository";

export class FCMService { 
  constructor(private fcm:IFcmRepository){}
  async registerToken(userId: string, token: string,role:string) {
    return this.fcm.saveOrUpdateToken(userId, token,role);
  }

  async removeToken(userId: string) {
    return this.fcm.deleteToken(userId);
  }

  async cleanupTokens() {
    return this.fcm.cleanupOldTokens(30);
  }

  async findAdminsToken(){
    const adminTokens = this.fcm.getAdminTokens()
    return adminTokens
  }

  async findRecruitersToken(id:Types.ObjectId[]){
    const tokens = this.fcm.getRecruitersTokensByIds(id)
    return tokens
  }


  async sendPushNotification(fcmTokens: string[], title: string, body: string, redirectUrl: string) {
    if (fcmTokens.length === 0) {
      console.error("No valid FCM tokens found.");
      return;
    }
  
    const payload = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        redirectUrl: redirectUrl,
      },
      tokens: fcmTokens,
    };
  
    try {
      const response = await admin.messaging().sendEachForMulticast(payload);
  
      console.log('Successfully sent notifications:', response);
  
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          console.error(`Error sending to ${fcmTokens[index]}:`, resp.error);
        }
      });
  
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }
  

}

