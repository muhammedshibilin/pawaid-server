import { IAnimalReportRepository } from "../interfaces/repositories/IAnimalRepository";
import { IAnimalReport } from "../interfaces/types/animal-report.interface";

class AnimalReportService {

    constructor(private animalRepository:IAnimalReportRepository){}
  async createAnimalReport(data: Partial<IAnimalReport>): Promise<IAnimalReport> {
     console.log('servicil aaan ppo illad',data)
    return await this.animalRepository.createAnimalReport(data);
  }

  async getAnimalReports(): Promise<IAnimalReport[]> {
    return await this.animalRepository.getAnimalReports();
  }

  async getAnimalReportById(id: string): Promise<IAnimalReport | null> {
    return await this.animalRepository.getAnimalReportById(id);
  }

  async updateAnimalReport(id: string, updateData: Partial<IAnimalReport>): Promise<IAnimalReport | null> {
    return await this.animalRepository.updateAnimalReport(id, updateData);
  }


}

export default AnimalReportService;
