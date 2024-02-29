import express, { Request, Response, NextFunction } from 'express';
import {
  CreateUser,
  updateUserController,
} from '../controllers/user.controller';
import { Authenticate } from '../middlewares';
import { createOrUpdateUserValidator } from '../validators/user.validator';

const router = express.Router();

router.use(Authenticate);
// router.post('', CreateUser);
router.patch('', createOrUpdateUserValidator, updateUserController);

export { router as UserRoute };
