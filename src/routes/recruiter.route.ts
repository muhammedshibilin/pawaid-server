import { Router } from 'express';
import createUploadService from '../services/implementation/upload.service';
import { RecruiterRepository } from '../repositories/implementations/recruiter.repository';
import { RecruiterService } from '../services/implementation/recruiter.service';
import { RecruiterController } from '../controllers/recruiter.controller';
import { BaseRepository } from '../repositories/implementations/base.repository';
import { IRecruiter } from '../entities/IRecruiter.interface';
import Recruiter from '../models/recruiter.model';
import authenticateJWT from '../middlewares/authentication';
import FCMRepository from '../repositories/implementations/fcm.repository';
import { FCMService } from '../services/implementation/fcm.service';
import { RecruiterAlertRepository } from '../repositories/implementations/recruiter-alert.repository';
import { RecruiterAlertService } from '../services/implementation/recruiter-alert.service';
import { RecruiterAlertController } from '../controllers/recruiter-alert.controller';


const recruiterRoute = Router();


const upload = createUploadService('recruiters')


const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)

const recruiterRepository = new RecruiterRepository()
const baseRepository = new BaseRepository<IRecruiter>(Recruiter)
const recruiterService = new RecruiterService(recruiterRepository,baseRepository)
const recruiterController = new RecruiterController(recruiterService,fcmService);






const recruiterAlert = new RecruiterAlertRepository()
const recruiterAlertService = new RecruiterAlertService(recruiterAlert,recruiterRepository)
const recruiterAlertController = new RecruiterAlertController(recruiterAlertService)



recruiterRoute.post('/register',upload.single('document'),recruiterController.register.bind(recruiterController));
recruiterRoute.post('/login', recruiterController.login.bind(recruiterController));
recruiterRoute.get('/profile',authenticateJWT(['recruiter']),recruiterController.getProfile.bind(recruiterController))
recruiterRoute.post('/reset-password',recruiterController.resetPassword.bind(recruiterController))


recruiterRoute.get('/rescue-alert/:recruiterId', recruiterAlertController.fetchRescueAlertsForRecruiter.bind(recruiterAlertController));
recruiterRoute.post('/accept-rescue',recruiterAlertController.acceptRescue.bind(recruiterAlertController))

export default recruiterRoute;
