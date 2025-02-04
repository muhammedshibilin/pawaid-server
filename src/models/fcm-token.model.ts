import mongoose, { Schema } from "mongoose";
import { IFCMToken } from "../interfaces/types/IFcm-token.interface";

const FCMTokenSchema = new Schema<IFCMToken>(
    {
      userId: { type: String, required: true, unique: true },
      token: { type: String, required: true },
      role:{type:String,required:true},
      lastUsedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IFCMToken>("FCMToken", FCMTokenSchema);