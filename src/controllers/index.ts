import { services } from "../services";
import AdminController from "./implementation/admin.controller";
import AnimalReportController from "./implementation/animal.controller";
import { DoctorController } from "./implementation/doctor.controller";
import FCMController from "./implementation/fcm.controller";
import { RecruiterAlertController } from "./implementation/recruiter-alert.controller";
import { RecruiterController } from "./implementation/recruiter.controller";
import UserController from "./implementation/user.controller";

export const controllers = {
  adminController: new AdminController(services.adminService),
  animalReportController: new AnimalReportController(
    services.animalReportService,
    services.fcmService,
    services.recruiterAlertService,
    services.recruiterService
  ),
  doctorController: new DoctorController(services.doctorService, services.fcmService),
  recruiterController: new RecruiterController(services.recruiterService, services.fcmService),
  recruiterAlertController: new RecruiterAlertController(services.recruiterAlertService),
  userController: new UserController(services.userService),
  fcmController: new FCMController(services.fcmService),
};
