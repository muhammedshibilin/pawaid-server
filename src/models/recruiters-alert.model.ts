import mongoose, { Schema, Model, Document } from "mongoose";
import { IRecruiterAlert } from "../interfaces/types/IRecruiters-alert.interface";

const RecruiterAlertSchema: Schema = new Schema<IRecruiterAlert>(
  {
    animalReportId: { type: Schema.Types.ObjectId, ref: "AnimalReport", required: true }, 
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
    notifiedRecruiters: [{ type: Schema.Types.ObjectId, ref: "Recruiter" }],
  },
  { timestamps: true }
);

const RecruiterAlert: Model<IRecruiterAlert> = mongoose.model<IRecruiterAlert>("RecruiterAlert", RecruiterAlertSchema);
export default RecruiterAlert;
