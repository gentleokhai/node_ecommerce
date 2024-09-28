import express from 'express';
import {
  createCompanyController,
  getCompanyByIdController,
  getCompanyCurrenciesController,
  getExchangeRateController,
  updateCompanyController,
  updateSellingCurrencyController,
  updateViewingCurrencyController,
} from '../controllers/company.controller';
import { AccessType } from '../dto/general';
import { Authenticate } from '../middlewares';
import { checkRole } from '../middlewares/checkRole';
import { validateCompany } from '../middlewares/validateCompany';
import {
  createCompanyValidator,
  updateCompanyValidator,
} from '../validators/company.validator';

const router = express.Router();

router.use(Authenticate);
router.get('/currencies', getCompanyCurrenciesController);
router.patch('/viewingCurrency', updateViewingCurrencyController);
router.get('/rate', getExchangeRateController);
router.get('', getCompanyByIdController);

router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER]));

router.post('', createCompanyValidator, createCompanyController);
router.use(validateCompany);
router.patch('/sellingCurrency', updateSellingCurrencyController);

export { router as CompanyRoute };
