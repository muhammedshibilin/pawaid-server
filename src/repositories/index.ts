import { IDoctor } from "../entities/IDocotor.interface";
import { IRecruiter } from "../entities/IRecruiter.interface";
import { IUser } from "../entities/IUser";
import Doctor from "../models/doctor.model";
import Recruiter from "../models/recruiter.model";
import User from "../models/user.model";
import AdminRepository from "./implementations/admin.repository";
import AnimalReportRepository from "./implementations/animal.repository";
import { BaseRepository } from "./implementations/base.repository";
import { DoctorRepository } from "./implementations/doctor.repository";
import FCMRepository from "./implementations/fcm.repository";
import { RecruiterRepository } from "./implementations/recruiter.repository";
import UserRepository from "./implementations/user.repository";


export const repositories = {
  adminRepository: new AdminRepository(),
  animalReportRepository: new AnimalReportRepository(),
  doctorRepository: new DoctorRepository(),
  recruiterRepository: new RecruiterRepository(),
  userRepository: new UserRepository(),
  fcmRepository: new FCMRepository(),
  

  userBaseRepository: new BaseRepository<IUser>(User),
  doctorBaseRepository: new BaseRepository<IDoctor>(Doctor),
  recruiterBaseRepository: new BaseRepository<IRecruiter>(Recruiter),
};
