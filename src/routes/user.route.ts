import { Router } from "express";
import refreshAccessToken from "../middlewares/refreshtoken";
import UserController from "../controllers/user.controller";
import UserService from "../services/implementation/user.service";
import UserRepository from "../repositories/implementations/user.repository";
import authenticateJWT from '../middlewares/authentication';
import {logout} from "../utilities/cookie.util";
import dotenv from 'dotenv';
import { BaseRepository } from "../repositories/implementations/base.repository";
import { IUser } from "../entities/IUser";
import User from "../models/user.model";
dotenv.config();


const userRoute = Router();

const userRepository = new UserRepository();
const baseRepository = new BaseRepository<IUser>(User)
const userService = new UserService(userRepository,baseRepository);
const userController = new UserController(userService);

userRoute.post("/register", userController.register.bind(userController));
userRoute.post("/register-google-user",userController.registerGoogleUser.bind(userController))
userRoute.post('/find-user', userController.findUser.bind(userController));
userRoute.post('/login',userController.login.bind(userController))
userRoute.post('/logout',authenticateJWT(['user','admin','recruiter','doctor']),logout)
userRoute.get('/refresh-token',refreshAccessToken);
userRoute.post('/verify-email',userController.requestPasswordReset.bind(userController))
userRoute.post('/reset-password',userController.resetPassword.bind(userController))
userRoute.post('/verify-otp',userController.verifyOtp.bind(userController))
userRoute.post('/resend-otp',userController.resendOtp.bind(userController))
userRoute.get('/profile',authenticateJWT(['user','admin']),userController.getProfile.bind(userController))
userRoute.post('/verifyGoogleEmail', userController.verifyEmail.bind(userController));







export default userRoute;