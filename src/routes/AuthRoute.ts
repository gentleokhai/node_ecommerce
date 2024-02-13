import express from 'express';
import {
  loginController,
  signupController,
} from '../controllers/auth.controller';
import { loginValidator, signupValidator } from '../validators';

const router = express.Router();

router.post('/signup', signupValidator, signupController);
router.post('/login', loginValidator, loginController);

export { router as AuthRoute };
