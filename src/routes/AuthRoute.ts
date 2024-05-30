import express from 'express';
import {
  changePasswordController,
  loginController,
  signupController,
} from '../controllers/auth.controller';
import {
  changePasswordValidator,
  loginValidator,
  signupValidator,
} from '../validators';

const router = express.Router();

router.post('/signup', signupValidator, signupController);
router.post('/login', loginValidator, loginController);
router.post(
  '/change-password',
  changePasswordValidator,
  changePasswordController
);

export { router as AuthRoute };
