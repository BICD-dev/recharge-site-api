import Router from 'express'
import { loginController, registerController, sendVerificationCodeController } from './auth.controller';

const router = Router();

router.post('/login',loginController);
router.post('/register',registerController);
router.post("/verify", sendVerificationCodeController);
// reset password
