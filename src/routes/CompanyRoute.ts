import express from 'express';
import {
  createCompanyController,
  getCompanyByIdController,
  updateCompanyController,
} from '../controllers/company.controller';
import { AccessType } from '../dto/general';
import { Authenticate } from '../middlewares';
import { checkRole } from '../middlewares/checkRole';
import {
  createCompanyValidator,
  updateCompanyValidator,
} from '../validators/company.validator';

const router = express.Router();

router.use(Authenticate);
router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER]));

router.post('', createCompanyValidator, createCompanyController);
router.patch('/:id', updateCompanyValidator, updateCompanyController);
router.get('/:id', getCompanyByIdController);

export { router as CompanyRoute };
