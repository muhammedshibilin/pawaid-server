import { Router } from 'express';
import authenticateJWT from '../middlewares/authentication';
import AdminController from '../controllers/admin.controller';
import AdminService from '../services/implementation/admin.service';
import AdminRepository from '../repositories/implementations/admin.repository';
import { BaseRepository } from '../repositories/implementations/base.repository';
import { IUser } from '../entities/IUser';
import User from '../models/user.model';
import { IDoctor } from '../entities/IDocotor.interface';
import Doctor from '../models/doctor.model';
import { IRecruiter } from '../entities/IRecruiter.interface';
import Recruiter from '../models/recruiter.model';

const adminRepository = new AdminRepository();
const userBaseRepository = new BaseRepository<IUser>(User)
const doctorBaseRepository = new BaseRepository<IDoctor>(Doctor)
const recruiterBaseRepository = new BaseRepository<IRecruiter>(Recruiter)
const adminService = new AdminService(adminRepository,userBaseRepository,doctorBaseRepository,recruiterBaseRepository);
const adminController = new AdminController(adminService);


const adminRoute = Router();

adminRoute.post('/login',adminController.login.bind(adminController))
adminRoute.get('/users',authenticateJWT(['admin']),adminController.getUsers.bind(adminController));
adminRoute.get('/doctors',authenticateJWT(['admin']),adminController.getDoctors.bind(adminController));
adminRoute.get('/recruiters',authenticateJWT(['admin']),adminController.getRecruiters.bind(adminController));
adminRoute.patch('/block-user/:id', authenticateJWT(['admin']), adminController.blockUser.bind(adminController));
adminRoute.patch('/block-doctor/:id', authenticateJWT(['admin']), adminController.blockDoctor.bind(adminController));
adminRoute.patch('/block-recruiter/:id', authenticateJWT(['admin']), adminController.blockRecruiter.bind(adminController));
adminRoute.get('/unverified-doctors&recruiters',authenticateJWT(['admin']),adminController.getUnverifiedDoctorsAndRecruiters.bind(adminController))
adminRoute.post('/verify-doctor',adminController.verifyDoctor.bind(adminController))
adminRoute.post('/verify-recruiter',adminController.verifyRecruiter.bind(adminController))

export default adminRoute;
