import { IFcmRepository } from "../../interfaces/repositories/IFcmRepository";
import { IFCMToken } from "../../interfaces/types/IFcm-token.interface";
import fcmTokenModel from "../../models/fcm-token.model";

class FCMRepository implements IFcmRepository{
  async saveOrUpdateToken(userId: string, token: string,role:string): Promise<IFCMToken> {
    return fcmTokenModel.findOneAndUpdate(
      { userId },
      { token, lastUsedAt: new Date(),role},
      { new: true, upsert: true }
    )
  }

  async getToken(userId: string): Promise<IFCMToken | null> {
    return fcmTokenModel.findOne({ userId });
  }

  async deleteToken(userId: string): Promise<void> {
    await fcmTokenModel.deleteOne({ userId });
  }

  async getAdminTokens(): Promise<string[]> {
    const admins = await fcmTokenModel.find({ role: 'admin' });
      return admins.map(admin => admin.token);
  }
  

  async cleanupOldTokens(days: number): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - days);
    await fcmTokenModel.deleteMany({ lastUsedAt: { $lt: expiryDate } });
  }
}

export default FCMRepository;
