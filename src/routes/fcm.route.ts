import { Router} from "express";
import FCMRepository from "../repositories/implementations/fcm.repository";
import { FCMService } from "../services/fcm.service";
import FCMController from "../controllers/fcm.controller";
import authenticateJWT from "../middlewares/authentication";


const fcmRoute = Router()

const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)
const fcmController = new FCMController(fcmService)

fcmRoute.post('/subscribe',authenticateJWT(['user','admin','recruiter','doctor']),fcmController.registerToken.bind(fcmController))
fcmRoute.post('/unsubscribe',authenticateJWT(['user','admin','recruiter','doctor']),fcmController.removeToken.bind(fcmController))

export default fcmRoute