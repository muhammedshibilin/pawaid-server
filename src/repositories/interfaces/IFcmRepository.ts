import { IFCMToken } from "../../entities/IFcm-token.interface";

export interface IFcmRepository{
      saveOrUpdateToken(userId: string, token: string,role:string): Promise<IFCMToken>;
      getToken(userId: string): Promise<IFCMToken | null> 
      deleteToken(userId: string): Promise<void> 
      cleanupOldTokens(days: number): Promise<void> 
      getAdminTokens(): Promise<string[]>
      getRecruitersTokensByIds(recruiterIds: string[]): Promise<string[]>
}