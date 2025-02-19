import { Types } from "mongoose";

export interface IFCMService {
registerToken(userId: string, token: string, role: string): Promise<{ status: number; message: string }> 
removeToken(userId: string): Promise<{ status: number; message: string }> 
cleanupTokens(): Promise<{ status: number; message: string }> 
findAdminsToken(): Promise<{ status: number; message: string; data: string[] }>
findRecruitersToken(id: Types.ObjectId[]): Promise<{ status: number; message: string; data: string[] }> 
sendPushNotification(
    fcmTokens: string[],
    title: string,
    body: string,
    redirectUrl: string
  ): Promise<{ status: number; message: string }>

}
