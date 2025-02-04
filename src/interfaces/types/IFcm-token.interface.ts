import { Document} from "mongoose";

export interface IFCMToken extends Document {
  userId: string;
  token: string;
  role:string;
  lastUsedAt: Date;
}