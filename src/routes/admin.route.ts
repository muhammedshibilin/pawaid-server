import { Router } from 'express';
import authenticateJWT from '../middlewares/authentication';
import { controllers } from '../controllers';



const adminRoute = Router();

adminRoute.post('/login',
    controllers.adminController.login.bind(controllers.adminController))
adminRoute.get('/users',
    authenticateJWT(['admin']),
    controllers.adminController.getUsers.bind(controllers.adminController));
adminRoute.get('/doctors',
    authenticateJWT(['admin']),
    controllers.adminController.getDoctors.bind(controllers.adminController));
adminRoute.get('/recruiters',
    authenticateJWT(['admin']),
    controllers.adminController.getRecruiters.bind(controllers.adminController));
adminRoute.patch('/block-user/:id',
    authenticateJWT(['admin']),
    controllers.adminController.blockUser.bind(controllers.adminController));
adminRoute.patch('/block-doctor/:id',
    authenticateJWT(['admin']),
    controllers.adminController.blockDoctor.bind(controllers.adminController));
adminRoute.patch('/block-recruiter/:id',
    authenticateJWT(['admin']),
    controllers.adminController.blockRecruiter.bind(controllers.adminController));
adminRoute.get('/unverified-doctors&recruiters',
    authenticateJWT(['admin']),
    controllers.adminController.getUnverifiedDoctorsAndRecruiters.bind( controllers.adminController))
adminRoute.post('/verify-doctor',
    controllers.adminController.verifyDoctor.bind( controllers.adminController))
adminRoute.post('/verify-recruiter',
    controllers.adminController.verifyRecruiter.bind( controllers.adminController))

export default adminRoute;
