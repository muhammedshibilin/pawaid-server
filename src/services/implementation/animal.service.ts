import { Types } from "mongoose";
import { IAnimalReport } from "../../entities/animal-report.interface";
import { IAnimalReportRepository } from "../../repositories/interfaces/IAnimalRepository";
import { IRecruiterRepository } from "../../repositories/interfaces/IRecruiterRepository";
import { IAnimalReportService } from "../interface/IAnimalReportService.interface";

class AnimalReportService implements IAnimalReportService {

    constructor(private animalRepository:IAnimalReportRepository,private recruiterRepository:IRecruiterRepository){}
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


  async updateAlert(animalReportId: string,recruiterId:string,status:string): Promise<IAnimalReport| null> {
      if(status === 'accepted'){
        await this.recruiterRepository.updateAvailability(recruiterId)
      }
      return await this.animalRepository.updateAlertStatus(animalReportId,status,recruiterId);
    }

    async updateDoctors(animalReportId:Types.ObjectId,doctors:Types.ObjectId[]):Promise<IAnimalReport|null>{
      return await this.animalRepository.updateDoctors(animalReportId,doctors)  
    }


}

export default AnimalReportService;
