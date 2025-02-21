import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { IDoctor } from "../../entities/IDocotor.interface";
import Doctor from "../../models/doctor.model";
import AnimalReport from "../../models/animal-report.model";

export class DoctorRepository implements IDoctorRepository {
    async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
        const doctor = new Doctor(doctorData);
        return doctor.save();
      }
      async updatePassword(id: string, hashedPassword: string): Promise<IDoctor | null> {
        return await Doctor.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
    }

    async findDoctors():Promise<IDoctor[]>{
        return await Doctor.find()
    }

    async updateAvailability(doctorId: string): Promise<boolean> {
        try {
          console.log('doctorId',doctorId)
            const doctor = await Doctor.findById({ _id:doctorId });
            console.log('doctor find',doctor)
            if (!doctor) {
                console.log("doctor not found");
                return false; 
            }
    
            const updatedAvailability = !doctor.is_available;
  
            console.log('recrutier availability',updatedAvailability)
    
            const updatedDoctor = await Doctor.findByIdAndUpdate(
                doctor._id, 
                {is_available: updatedAvailability },
                { new: true } 
            );
  
            console.log('updated doctor',updatedDoctor)
    
            return updatedDoctor ? true : false;
        } catch (error) {
            console.error("Error updating doctor availability:", error);
            return false; 
        }
    }
     
}
