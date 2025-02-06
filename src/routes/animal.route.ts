import { Router} from "express";
import createUploadService from "../services/upload.service";
import authenticateJWT from "../middlewares/authentication";
import AnimalRepository from "../repositories/implementations/animal.repository";
import AnimalReportService from "../services/animal.service";
import AnimalReportController from "../controllers/animal.controller";
import FCMRepository from "../repositories/implementations/fcm.repository";
import { FCMService } from "../services/fcm.service";
import RecruiterAlert from "../models/recruiters-alert.model";
import { RecruiterAlertService } from "../services/recruiter-alert.service";
import { RecruiterAlertRepository } from "../repositories/implementations/recruiter-alert.repository";
import { RecruiterRepository } from "../repositories/implementations/recruiter.repository";
import { RecruiterService } from "../services/recruiter.service";
import { BaseRepository } from "../repositories/implementations/base.repository";
import { IRecruiter } from "../interfaces/types/IRecruiter.interface";
import Recruiter from "../models/recruiter.model";
const animalRoute = Router()


const upload = createUploadService('reports')


const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)

const recruiterAlertRepository = new RecruiterAlertRepository()
const recruiterAlertService = new RecruiterAlertService(recruiterAlertRepository)


const recruiterRepository = new RecruiterRepository()
const baseRepository = new BaseRepository<IRecruiter>(Recruiter)
const recruiterService = new RecruiterService(recruiterRepository,baseRepository)

const animalRepository = new AnimalRepository()
const animalService = new AnimalReportService(animalRepository)
const animalReportController = new AnimalReportController(animalService,fcmService,recruiterAlertService,recruiterService)

animalRoute.post('/animal-report',upload.single('image'),authenticateJWT(['user']),animalReportController.create.bind(animalReportController))
animalRoute.get('/animal0-report',animalReportController.getAnimalReport.bind(animalReportController))

export default animalRoute