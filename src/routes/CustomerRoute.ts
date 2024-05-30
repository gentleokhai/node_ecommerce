import express from 'express';
import {
  createCustomerController,
  getCustomersController,
} from '../controllers/customer.controller';
import { Authenticate } from '../middlewares';
import { createCustomerValidator } from '../validators/customer.validator';

const router = express.Router();

router.use(Authenticate);
router.post('', createCustomerValidator, createCustomerController);
router.get('', getCustomersController);

export { router as CustomerRoute };
