import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import { IDoctor } from "../../entities/IDocotor.interface";
import Doctor from "../../models/doctor.model";

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
     
}
