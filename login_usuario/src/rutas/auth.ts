import {Router} from 'express';
import AuthController from '../controller/authControllers';
import { checkJwt } from '../middleware/jwt';

const router = Router();

//login
router.post('/login', AuthController.login);

// Change password
router.post('/change-pasword', [checkJwt], AuthController.changePassword);

export default router;
