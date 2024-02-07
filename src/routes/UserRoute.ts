import express, { Request, Response, NextFunction } from 'express';
import { CreateUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/create', CreateUser);

export { router as UserRoute };
