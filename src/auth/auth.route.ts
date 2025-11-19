import Router from 'express'
import { loginController, registerController, sendVerificationCodeController } from './auth.controller';

const router = Router();

router.post('/login',loginController);
router.post('/register',registerController);
router.post("/send-verification-code", sendVerificationCodeController);
// verifiy the code
// reset password
