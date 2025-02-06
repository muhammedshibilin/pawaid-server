import { Document, Types } from "mongoose";

export interface IRecruiterAlert extends Document {
  animalReportId: Types.ObjectId; 
  status?: "pending" | "accepted";
  notifiedRecruiters: Types.ObjectId[]; 
}
