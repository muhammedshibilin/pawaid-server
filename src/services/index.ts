import { repositories } from "../repositories";
import AdminService from "./implementation/admin.service";
import AnimalReportService from "./implementation/animal.service";
import { DoctorService } from "./implementation/doctor.service";
import { FCMService } from "./implementation/fcm.service";
import { RecruiterService } from "./implementation/recruiter.service";
import UserService from "./implementation/user.service";


export const services = {
  adminService: new AdminService(
    repositories.adminRepository,
    repositories.userBaseRepository,
    repositories.doctorBaseRepository,
    repositories.recruiterBaseRepository
  ),
  
  recruiterService: new RecruiterService(
    repositories.recruiterRepository,
    repositories.recruiterBaseRepository,
    repositories.animalReportRepository
  ),


  animalReportService: new AnimalReportService(repositories.animalReportRepository,repositories.recruiterRepository),

  doctorService: new DoctorService(
    repositories.doctorRepository,
    repositories.doctorBaseRepository,
    repositories.animalReportRepository
  ),

  userService: new UserService(
    repositories.userRepository,
    repositories.userBaseRepository
  ),

  fcmService: new FCMService(repositories.fcmRepository),
};
