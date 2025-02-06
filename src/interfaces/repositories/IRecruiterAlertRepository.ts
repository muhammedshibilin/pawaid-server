import { IRecruiterAlert } from "../types/IRecruiters-alert.interface";

export interface IRecruiterAlertRepository {
  createRecruiterAlert(alertData: Partial<IRecruiterAlert>): Promise<IRecruiterAlert>;
  updateAlertStatus(alertId: string, status: "accepted"): Promise<IRecruiterAlert | null>;
}
