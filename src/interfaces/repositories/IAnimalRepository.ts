import { IAnimalReport } from "../types/animal-report.interface";

export interface IAnimalReportRepository {
  createAnimalReport(data: Partial<IAnimalReport>): Promise<IAnimalReport>;
  getAnimalReports(): Promise<IAnimalReport[]>;
  getAnimalReportById(id: string): Promise<IAnimalReport | null>;
  updateAnimalReport(id: string, updateData: Partial<IAnimalReport>): Promise<IAnimalReport | null>;
}
