import express from 'express';
import { createCompanyController } from '../controllers/company.controller';
import { Authenticate } from '../middlewares';
import { createCompanyValidator } from '../validators/company.validator';

const router = express.Router();

router.use(Authenticate);

router.post('', createCompanyValidator, createCompanyController);

export { router as CompanyRoute };
