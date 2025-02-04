import { Router } from 'express';
import createUploadService from '../services/upload.service';
import { RecruiterRepository } from '../repositories/implementations/recruiter.repository';
import { RecruiterService } from '../services/recruiter.service';
import { RecruiterController } from '../controllers/recruiter.controller';
import { BaseRepository } from '../repositories/implementations/base.repository';
import { IRecruiter } from '../interfaces/types/IRecruiter.interface';
import Recruiter from '../models/recruiter.model';
import authenticateJWT from '../middlewares/authentication';
import FCMRepository from '../repositories/implementations/fcm.repository';
import { FCMService } from '../services/fcm.service';


const recruiterRoute = Router();


const upload = createUploadService('recruiters')


const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)

const recruiterRepository = new RecruiterRepository()
const baseRepository = new BaseRepository<IRecruiter>(Recruiter)
const recruiterService = new RecruiterService(recruiterRepository,baseRepository)
const recruiterController = new RecruiterController(recruiterService,fcmService);

recruiterRoute.post('/register',upload.single('document'),recruiterController.register.bind(recruiterController));
recruiterRoute.post('/login', recruiterController.login.bind(recruiterController));
recruiterRoute.get('/profile',authenticateJWT(['recruiter']),recruiterController.getProfile.bind(recruiterController))

recruiterRoute.post('/reset-password',recruiterController.resetPassword.bind(recruiterController))


export default recruiterRoute;
