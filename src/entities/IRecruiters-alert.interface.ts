import { Document, Types } from "mongoose";
import { IRescueAlert } from "../repositories/implementations/recruiter-alert.repository";

export interface IRecruiterAlert extends Document {
  animalReportId: Types.ObjectId|IRescueAlert; 
  status?: "pending" | "accepted";
  notifiedRecruiters: Types.ObjectId[]; 
}
