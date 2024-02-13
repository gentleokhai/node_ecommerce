import express, { Request, Response, NextFunction } from 'express';
import { CreateUser } from '../controllers/user.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.use(Authenticate);
router.post('/create', CreateUser);

export { router as UserRoute };
