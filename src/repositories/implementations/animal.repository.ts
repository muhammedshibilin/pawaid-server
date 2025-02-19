import { IAnimalReportRepository } from "../interfaces/IAnimalRepository";
import AnimalReport from "../../models/animal-report.model";
import { IAnimalReport } from "../../entities/animal-report.interface";
import { Types } from "mongoose";


class AnimalReportRepository  implements IAnimalReportRepository {

  async createAnimalReport(animalReportData: Partial<IAnimalReport>): Promise<IAnimalReport> {
    const newReport = new AnimalReport(animalReportData);
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


  async updateAlertStatus(alertId: string, status:string,recruiterId:string): Promise<IAnimalReport| null> {
    return await AnimalReport.findByIdAndUpdate(alertId, 
      { status,recruiterId: [new Types.ObjectId(recruiterId)] },
       { new: true });
  }

  async getRescueAlertsByRecruiter(recruiterId: string): Promise<IAnimalReport[]>{
    return await AnimalReport.find({ 
      recruiterId: recruiterId,
      })
  }

  async getRescueAppointment(doctorId:string): Promise<IAnimalReport[]>{
    return await AnimalReport.find({ 
      doctorId: doctorId,
      })
  }

  async updateDoctors(animalReportId:Types.ObjectId,doctors:Types.ObjectId[]):Promise<IAnimalReport|null>{
    return await AnimalReport.findByIdAndUpdate(animalReportId,{doctorId:doctors},{new:true})
  }


}

export default AnimalReportRepository;
