import { Router } from "express";
import refreshAccessToken from "../middlewares/refreshtoken";
import authenticateJWT from '../middlewares/authentication';
import {logout} from "../utilities/cookie.util";
import dotenv from 'dotenv';

import { controllers } from "../controllers";
dotenv.config();


const userRoute = Router();

userRoute.post("/register",
     controllers.userController.register.bind(controllers.userController));
userRoute.post("/register-google-user",
     controllers.userController.registerGoogleUser.bind(controllers.userController));
userRoute.post("/find-user",
     controllers.userController.findUser.bind(controllers.userController));
userRoute.post("/login", 
    controllers.userController.login.bind(controllers.userController));
userRoute.post("/logout",
     authenticateJWT(["user", "admin", "recruiter", "doctor"]),
      logout);
userRoute.get("/refresh-token", refreshAccessToken);
userRoute.post("/verify-email",
     controllers.userController.requestPasswordReset.bind(controllers.userController));
userRoute.post("/reset-password", 
    controllers.userController.resetPassword.bind(controllers.userController));
userRoute.post("/verify-otp",
     controllers.userController.verifyOtp.bind(controllers.userController));
userRoute.post("/resend-otp", 
    controllers.userController.resendOtp.bind(controllers.userController));
userRoute.get("/profile", 
    authenticateJWT(["user", "admin"]), 
    controllers.userController.getProfile.bind(controllers.userController));
userRoute.post("/verifyGoogleEmail",
     controllers.userController.verifyEmail.bind(controllers.userController));



export default userRoute;