import { Router} from "express";
import createUploadService from "../services/upload.service";
import authenticateJWT from "../middlewares/authentication";
import AnimalRepository from "../repositories/implementations/animal.repository";
import AnimalReportService from "../services/animal.service";
import AnimalReportController from "../controllers/animal.controller";
import FCMRepository from "../repositories/implementations/fcm.repository";
import { FCMService } from "../services/fcm.service";
const animalRoute = Router()


const upload = createUploadService('reports')


const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)


const animalRepository = new AnimalRepository()
const animalService = new AnimalReportService(animalRepository)
const animalReportController = new AnimalReportController(animalService,fcmService)

animalRoute.post('/animal-report',upload.single('image'),authenticateJWT(['user']),animalReportController.create.bind(animalReportController))
animalRoute.get('/animal0-report',animalReportController.getAnimalReport.bind(animalReportController))

export default animalRoute