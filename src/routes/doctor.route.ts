import { Router } from 'express';
import createUploadService from '../services/implementation/upload.service';
import authenticateJWT from '../middlewares/authentication';
import { controllers } from '../controllers';


const upload = createUploadService('doctors')
const doctorRoute = Router();


doctorRoute.post('/register',
    upload.single('document'),
    controllers.doctorController.register.bind(controllers.doctorController));

doctorRoute.post('/login',
    controllers.doctorController.login.bind(controllers.doctorController));

doctorRoute.get('/profile',
    authenticateJWT(['doctor']),
    controllers.doctorController.getProfile.bind(controllers.doctorController))

doctorRoute.post('/reset-password',
    controllers.doctorController.resetPassword.bind(controllers.doctorController))

doctorRoute.get("/rescue-appointment/:doctorId",
        authenticateJWT(['doctor']),
        controllers.animalReportController.fetchRescueAppointment.bind(controllers.animalReportController));
    
export default doctorRoute;
