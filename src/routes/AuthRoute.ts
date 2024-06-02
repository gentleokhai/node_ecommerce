import express from 'express';
import {
  changePasswordController,
  forgotPasswordController,
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
router.post('/forgot-password', forgotPasswordController);

export { router as AuthRoute };
