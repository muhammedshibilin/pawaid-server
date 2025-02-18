import { IAnimalReport } from "../../entities/animal-report.interface";

export interface IRecruiterAlertRepository {
  updateAlertStatus(alertId: string, status:string): Promise<IAnimalReport| null>;
  getRescueAlertsByRecruiter(recruiterId: string): Promise<IAnimalReport[]|null> 
}
