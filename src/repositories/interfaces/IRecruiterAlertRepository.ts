import { IAnimalReport } from "../../entities/animal-report.interface";

export interface IRecruiterAlertRepository {
  getRescueAlertsByRecruiter(recruiterId: string): Promise<IAnimalReport[]|null> 
}
