import express from 'express';
import {
  createCustomerController,
  getCustomersController,
} from '../controllers/customer.controller';
import { AccessType } from '../dto/general';
import { Authenticate } from '../middlewares';
import { checkRole } from '../middlewares/checkRole';
import { createCustomerValidator } from '../validators/customer.validator';

const router = express.Router();

router.use(Authenticate);
router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER, AccessType.CASHIER]));
router.post('', createCustomerValidator, createCustomerController);
router.get('', getCustomersController);

export { router as CustomerRoute };
