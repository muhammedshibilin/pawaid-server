import { Router} from "express";
import authenticateJWT from "../middlewares/authentication";
import { controllers } from "../controllers";


const fcmRoute = Router()

fcmRoute.post('/subscribe',
    authenticateJWT(['user','admin','recruiter','doctor']),
    controllers.fcmController.registerToken.bind(controllers.fcmController))

fcmRoute.post('/unsubscribe',
    authenticateJWT(['user','admin','recruiter','doctor']),
    controllers.fcmController.removeToken.bind(controllers.fcmController))

    

export default fcmRoute