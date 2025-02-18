import { IDoctor } from "../../entities/IDocotor.interface";

export interface IDoctorRepository {
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;
  updatePassword(id: string, hashedPassword: string): Promise<IDoctor | null>;
  
}
