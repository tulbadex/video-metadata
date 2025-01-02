import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authValidation } from '../middleware/validation';

const router = Router()
const authController = new AuthController()

// Bind class methods to maintain 'this' context
router.post('/login', authValidation.login, authController.login.bind(authController));
router.post('/register', authValidation.register,  authController.register.bind(authController));

export default router