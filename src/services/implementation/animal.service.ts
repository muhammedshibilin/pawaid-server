import { Types } from "mongoose";
import { IAnimalReport } from "../../entities/animal-report.interface";
import { IAnimalReportRepository } from "../../repositories/interfaces/IAnimalRepository";
import { IRecruiterRepository } from "../../repositories/interfaces/IRecruiterRepository";
import { IAnimalReportService } from "../interface/IAnimalReportService.interface";
import { IDoctorRepository } from "../../repositories/interfaces/IDoctorRepository";
import { AnimalStatus } from "../../enums/animal-status.enum";

class AnimalReportService implements IAnimalReportService {

    constructor(private animalRepository:IAnimalReportRepository,
      private recruiterRepository:IRecruiterRepository,
      private doctorRepository:IDoctorRepository
    ){}
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


  async updateAlert(animalReportId: string,status:string,recruiterId?:string,doctorId?:string): Promise<IAnimalReport| null> {
     
    const animalReport = await this.animalRepository.updateAlertStatus(animalReportId,status,recruiterId,doctorId);

    if(status === 'accepted'&&recruiterId){
        console.log('ahhiiii',status)
        await this.recruiterRepository.updateAvailability(recruiterId)
      }
      if(status === 'booked'&&doctorId){
        await this.doctorRepository.updateAvailability(doctorId)
      }

      if(animalReport?.status == AnimalStatus.TREATED){
        await this.recruiterRepository.updateAvailability(animalReport.recruiterId?.toString()!)
        await this.doctorRepository.updateAvailability(animalReport.doctorId?.toString()!)
      }

      return animalReport
    }

    async updateDoctors(animalReportId:Types.ObjectId,doctors:Types.ObjectId[]):Promise<IAnimalReport|null>{
      return await this.animalRepository.updateDoctors(animalReportId,doctors)  
    }


}

export default AnimalReportService;
