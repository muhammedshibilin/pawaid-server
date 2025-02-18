import { repositories } from "../repositories";
import AdminService from "./implementation/admin.service";
import AnimalReportService from "./implementation/animal.service";
import { DoctorService } from "./implementation/doctor.service";
import { FCMService } from "./implementation/fcm.service";
import { RecruiterAlertService } from "./implementation/recruiter-alert.service";
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
    repositories.recruiterBaseRepository
  ),

  recruiterAlertService: new RecruiterAlertService(
    repositories.recruiterAlertRepository,
    repositories.recruiterRepository
  ),

  animalReportService: new AnimalReportService(repositories.animalReportRepository),

  doctorService: new DoctorService(
    repositories.doctorRepository,
    repositories.doctorBaseRepository
  ),

  userService: new UserService(
    repositories.userRepository,
    repositories.userBaseRepository
  ),

  fcmService: new FCMService(repositories.fcmRepository),
};
