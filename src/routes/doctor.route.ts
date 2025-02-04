import { Router } from 'express';
import createUploadService from '../services/upload.service';
import { DoctorController } from '../controllers/doctor.controller';
import { DoctorRepository } from '../repositories/implementations/doctor.repository';
import { DoctorService } from '../services/doctor.service';
import { BaseRepository } from '../repositories/implementations/base.repository';
import { IDoctor } from '../interfaces/types/IDocotor.interface';
import Doctor from '../models/doctor.model';
import authenticateJWT from '../middlewares/authentication';
import FCMRepository from '../repositories/implementations/fcm.repository';
import { FCMService } from '../services/fcm.service';
const doctorRoute = Router();


const upload = createUploadService('doctors')

const fcmRepository = new FCMRepository()
const fcmService = new FCMService(fcmRepository)

const baseRepository = new BaseRepository<IDoctor>(Doctor)
const doctorRepository = new DoctorRepository()
const doctorService = new DoctorService(doctorRepository,baseRepository)
const doctorController = new DoctorController(doctorService,fcmService);

doctorRoute.post('/register',upload.single('document'),doctorController.register.bind(doctorController));
doctorRoute.post('/login', doctorController.login.bind(doctorController));
doctorRoute.get('/profile',authenticateJWT(['doctor']),doctorController.getProfile.bind(doctorController))

doctorRoute.post('/reset-password',doctorController.resetPassword.bind(doctorController))



export default doctorRoute;
