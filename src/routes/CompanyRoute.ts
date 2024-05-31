import express from 'express';
import { createCompanyController } from '../controllers/company.controller';
import { AccessType } from '../dto/general';
import { Authenticate } from '../middlewares';
import { checkRole } from '../middlewares/checkRole';
import { createCompanyValidator } from '../validators/company.validator';

const router = express.Router();

router.use(Authenticate);
router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER]));

router.post('', createCompanyValidator, createCompanyController);

export { router as CompanyRoute };
