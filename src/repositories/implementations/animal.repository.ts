import { IAnimalReportRepository } from "../interfaces/IAnimalRepository";
import AnimalReport from "../../models/animal-report.model";
import { IAnimalReport } from "../../entities/animal-report.interface";


class AnimalReportRepository  implements IAnimalReportRepository {

  async createAnimalReport(animalReportData: Partial<IAnimalReport>): Promise<IAnimalReport> {
    const newReport = new AnimalReport(animalReportData);
    console.log('aimial report is ready to save ',newReport)
    return await newReport.save();
  }


  async getAnimalReports(): Promise<IAnimalReport[]> {
    return await AnimalReport.find();
  }

  async getAnimalReportById(id: string): Promise<IAnimalReport | null> {
    return await AnimalReport.findById(id);
  }
  async updateAnimalReport(id: string, updateData: Partial<IAnimalReport>): Promise<IAnimalReport | null> {
    return await AnimalReport.findByIdAndUpdate(id, updateData, { new: true });
  }


}

export default AnimalReportRepository;
