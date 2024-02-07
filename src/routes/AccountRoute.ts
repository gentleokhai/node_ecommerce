import express, { Request, Response, NextFunction } from 'express';
import { CreateAccount } from '../controllers/account.controller';

const router = express.Router();

router.post('/create', CreateAccount);

export { router as AccountRoute };
