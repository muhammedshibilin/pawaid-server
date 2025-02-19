import { Router } from "express";
import createUploadService from "../services/implementation/upload.service";
import authenticateJWT from "../middlewares/authentication";
import { controllers } from "../controllers";


const upload = createUploadService('reports')

const animalRoute = Router()


animalRoute.post('/animal-report', upload.single('image'),
    authenticateJWT(['user']),
    controllers.animalReportController.create.bind(controllers.animalReportController))
animalRoute.post("/update-alert",
    controllers.animalReportController.updateAlert.bind(controllers.animalReportController));




export default animalRoute