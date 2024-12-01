import express from 'express';
import DoctorController from '../controllers/DoctorController';
import DoctorAuthMiddleware from '../middlewares/DoctorAuthMiddleware';

const router = express.Router();

router.post('/signup', DoctorController.signup);
router.post('/login', DoctorController.login);
router.post('/logout', DoctorController.logout);

router.get('/profile', DoctorAuthMiddleware);

export default router;