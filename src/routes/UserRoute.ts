import express, { Request, Response, NextFunction } from 'express';
import { CreateUser, updateUserController } from '../controllers/user.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.use(Authenticate);
// router.post('', CreateUser);
router.patch('', updateUserController);

export { router as UserRoute };
