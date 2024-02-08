import express, { Request, Response, NextFunction } from 'express';
import { CreateCompany } from '../controllers/company.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.use(Authenticate);

router.post('/create', CreateCompany);

export { router as CompanyRoute };
