import { IDoctor } from "../types/IDocotor.interface";

export interface IDoctorRepository {
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;
  updatePassword(id: string, hashedPassword: string): Promise<IDoctor | null>;
  
}
