import { Types } from "mongoose";
import { IAnimalReport } from "../../entities/animal-report.interface";

export interface IAnimalReportService {
    createAnimalReport(data: Partial<IAnimalReport>): Promise<IAnimalReport>;
    getAnimalReports(): Promise<IAnimalReport[]>;
    getAnimalReportById(id: string): Promise<IAnimalReport | null>;
    updateAlert(animalReportId: string,recruiterId:string,status:string): Promise<IAnimalReport| null>
    updateDoctors(animalReportId:Types.ObjectId,doctors:Types.ObjectId[]):Promise<IAnimalReport|null>
  }
  