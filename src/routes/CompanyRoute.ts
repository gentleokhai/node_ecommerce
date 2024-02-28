import express, { Request, Response, NextFunction } from 'express';
import { createCompanyController } from '../controllers/company.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.use(Authenticate);

router.post('', createCompanyController);

export { router as CompanyRoute };
