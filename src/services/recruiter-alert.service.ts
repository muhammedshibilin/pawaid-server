import { Types } from "mongoose";
import { IRecruiterAlertRepository } from "../interfaces/repositories/IRecruiterAlertRepository";
import { IRecruiterAlert } from "../interfaces/types/IRecruiters-alert.interface";

export class RecruiterAlertService {
  constructor(private recruiterAlertRepo: IRecruiterAlertRepository) {}

  async notifyRecruiters(animalReportId: string, notifiedRecruiters: string[]): Promise<IRecruiterAlert> {
    return await this.recruiterAlertRepo.createRecruiterAlert({
      animalReportId: new Types.ObjectId(animalReportId), 
      notifiedRecruiters: notifiedRecruiters.map(id => new Types.ObjectId(id)), 
    });
  }

  async acceptAlert(alertId: string): Promise<IRecruiterAlert | null> {
    return await this.recruiterAlertRepo.updateAlertStatus(alertId, "accepted");
  }
}
