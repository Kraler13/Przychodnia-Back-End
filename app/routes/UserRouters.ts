import express from 'express';
import UserController from '../controllers/UserController';
import UserAuthMiddleware from '../middlewares/UserAuthMiddleware';

const router = express.Router();

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.get('/profile', UserAuthMiddleware);

export default router;