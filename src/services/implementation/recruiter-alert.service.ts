import { IRecruiterAlertRepository } from "../../repositories/interfaces/IRecruiterAlertRepository";
import { IAnimalReport } from "../../entities/animal-report.interface";
import { RescueAlertDTO } from "../../dto/rescue-alert.dto";
import { IRecruiterRepository } from "../../repositories/interfaces/IRecruiterRepository";

export class RecruiterAlertService {
  constructor(private recruiterAlertRepository: IRecruiterAlertRepository,private recruiterRepository:IRecruiterRepository) {}

  async updateAlert(animalReportId: string,recruiterId:string,status:string,location:string): Promise<IAnimalReport| null> {
    if(status === 'accepted'){
      await this.recruiterRepository.updateAvailability(recruiterId)
    }
    return await this.recruiterAlertRepository.updateAlertStatus(animalReportId,status);
  }


  async fetchRescueAlertsForRecruiter(recruiterId: string): Promise<RescueAlertDTO[]> {
    const alerts = await this.recruiterAlertRepository.getRescueAlertsByRecruiter(recruiterId);
    console.log("Rescue alerts:", alerts);

    if (!alerts || alerts.length === 0) return [];

    return alerts.map(alert => ({
        id: alert._id,
        description:alert.description,
        status: alert.status,
        location: {
            lat: alert.location.latitude,
            lng: alert.location.longitude,
        },
    }));
}

      
}
