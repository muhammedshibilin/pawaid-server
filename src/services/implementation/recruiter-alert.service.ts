import { Types } from "mongoose";
import { IRecruiterAlertRepository } from "../../repositories/interfaces/IRecruiterAlertRepository";
import { IRecruiterAlert } from "../../entities/IRecruiters-alert.interface";
import { IRescueAlert } from "../../repositories/implementations/recruiter-alert.repository";

export class RecruiterAlertService {
  constructor(private recruiterAlertRepository: IRecruiterAlertRepository,) {}

  async notifyRecruiters(animalReportId: string, notifiedRecruiters: string[]): Promise<IRecruiterAlert> {
    return await this.recruiterAlertRepository.createRecruiterAlert({
      animalReportId: new Types.ObjectId(animalReportId), 
      notifiedRecruiters: notifiedRecruiters.map(id => new Types.ObjectId(id)), 
    });
  }

  async acceptAlert(alertId: string): Promise<IRecruiterAlert | null> {
    return await this.recruiterAlertRepository.updateAlertStatus(alertId, "accepted");
  }


  async fetchRescueAlertsForRecruiter(recruiterId: string) {
    const alerts = await this.recruiterAlertRepository.getRescueAlertsByRecruiter(recruiterId);
    if (!alerts) return [];
  
    return alerts.map((alert) => {
      const animalReport = alert.animalReportId as IRescueAlert; 
  
      return {
        id: alert._id,
        animalReportId: animalReport._id,  
        imageUrl: animalReport.imageUrl,
        status: alert.status,
        location: {
          lat: animalReport.location.latitude,
          lng: animalReport.location.longitude,
        },
      };
    });
  }
  
  

    
}
