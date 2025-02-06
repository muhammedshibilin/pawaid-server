import { IRecruiterAlertRepository } from "../../interfaces/repositories/IRecruiterAlertRepository";
import { IRecruiterAlert } from "../../interfaces/types/IRecruiters-alert.interface";
import RecruiterAlert from "../../models/recruiters-alert.model";

export class RecruiterAlertRepository implements IRecruiterAlertRepository {
    async createRecruiterAlert(alertData: Partial<IRecruiterAlert>): Promise<IRecruiterAlert> {
      return await RecruiterAlert.create(alertData);
    }
  
    async updateAlertStatus(alertId: string, status: "accepted"): Promise<IRecruiterAlert | null> {
      return await RecruiterAlert.findByIdAndUpdate(alertId, { status }, { new: true });
    }
}