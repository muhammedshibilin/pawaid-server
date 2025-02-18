import { Router} from "express";
import createUploadService from "../services/implementation/upload.service";
import authenticateJWT from "../middlewares/authentication";
import AnimalRepository from "../repositories/implementations/animal.repository";
import AnimalReportService from "../services/implementation/animal.service";
import AnimalReportController from "../controllers/animal.controller";
import FCMRepository from "../repositories/implementations/fcm.repository";
import { FCMService } from "../services/implementation/fcm.service";
import RecruiterAlert from "../models/recruiters-alert.model";
import { RecruiterAlertService } from "../services/implementation/recruiter-alert.service";
import { RecruiterAlertRepository } from "../repositories/implementations/recruiter-alert.repository";
import { RecruiterRepository } from "../repositories/implementations/recruiter.repository";
import { RecruiterService } from "../services/implementation/recruiter.service";
import { BaseRepository } from "../repositories/implementations/base.repository";
import { IRecruiter } from "../entities/IRecruiter.interface";
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

export default animalRoute