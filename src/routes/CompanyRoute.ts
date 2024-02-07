import express, { Request, Response, NextFunction } from 'express';
import { CreateCompany } from '../controllers/company.controller';

const router = express.Router();

router.post('/create', CreateCompany);

export { router as CompanyRoute };
