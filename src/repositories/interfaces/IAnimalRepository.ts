import { Types } from "mongoose";
import { IAnimalReport } from "../../entities/animal-report.interface";

export interface IAnimalReportRepository {
  createAnimalReport(data: Partial<IAnimalReport>): Promise<IAnimalReport>;
  getAnimalReports(): Promise<IAnimalReport[]>;
  getAnimalReportById(id: string): Promise<IAnimalReport | null>;
  updateAlertStatus(alertId: string, status:string,recruitedId?:string,doctorId?:string): Promise<IAnimalReport| null> 
  getRescueAlertsByRecruiter(recruiterId: string): Promise<IAnimalReport[]> 
  getRescueAppointment(doctorId:string): Promise<IAnimalReport[]>
  updateDoctors(animalReportId:Types.ObjectId,doctors:Types.ObjectId[]):Promise<IAnimalReport|null>
}
