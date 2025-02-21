import { IDoctor } from "../../entities/IDocotor.interface";

export interface IDoctorRepository {
  findDoctors():Promise<IDoctor[]>
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;
  updatePassword(id: string, hashedPassword: string): Promise<IDoctor | null>;
  updateAvailability(doctorId:string):Promise<boolean>;

}
