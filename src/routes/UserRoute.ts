import express, { Request, Response, NextFunction } from 'express';
import {
  CreateUser,
  UserSignUp,
  UserLogin,
} from '../controllers/user.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/signup', UserSignUp);
router.post('/login', UserLogin);

router.use(Authenticate);
router.post('/create', CreateUser);

export { router as UserRoute };
