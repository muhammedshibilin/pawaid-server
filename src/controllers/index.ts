import { services } from "../services";
import AdminController from "./implementation/admin.controller";
import AnimalReportController from "./implementation/animal.controller";
import { DoctorController } from "./implementation/doctor.controller";
import FCMController from "./implementation/fcm.controller";
import { RecruiterController } from "./implementation/recruiter.controller";
import UserController from "./implementation/user.controller";

export const controllers = {
  adminController: new AdminController(services.adminService),
  animalReportController: new AnimalReportController(
    services.animalReportService,
    services.fcmService,
    services.recruiterService,
    services.doctorService
  ),
  doctorController: new DoctorController(services.doctorService, services.fcmService),
  recruiterController: new RecruiterController(services.recruiterService, services.fcmService),
  userController: new UserController(services.userService),
  fcmController: new FCMController(services.fcmService),
};
