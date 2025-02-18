import { Router } from 'express';
import createUploadService from '../services/implementation/upload.service';
import authenticateJWT from '../middlewares/authentication';
import { controllers } from '../controllers';




const upload = createUploadService('recruiters')

const recruiterRoute = Router();

recruiterRoute.post("/register",
    upload.single("document"),
    controllers.recruiterController.register.bind(controllers.recruiterController));
recruiterRoute.post("/login",
    controllers.recruiterController.login.bind(controllers.recruiterController));
recruiterRoute.post("/reset-password",
    controllers.recruiterController.resetPassword.bind(controllers.recruiterController));
recruiterRoute.get("/profile",
    authenticateJWT(["recruiter"]),
    controllers.recruiterController.getProfile.bind(controllers.recruiterController));
recruiterRoute.get("/rescue-alert/:recruiterId",
    authenticateJWT(['recruiter']),
    controllers.recruiterAlertController.fetchRescueAlertsForRecruiter.bind(controllers.recruiterAlertController));
recruiterRoute.post("/update-alert",
    controllers.recruiterAlertController.updateAlert.bind(controllers.recruiterAlertController));



export default recruiterRoute;
