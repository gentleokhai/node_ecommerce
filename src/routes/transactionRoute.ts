import express from 'express';
import {
  createTransactionController,
  getTransactionsByCustomerController,
  getTransactionsByDateController,
  getTransactionsByIdController,
  getTransactionsController,
  refundTransactionController,
} from '../controllers/transaction.controller';
import { Authenticate } from '../middlewares';
import { validateCompany } from '../middlewares/validateCompany';
import {
  createRefundTransactionValidator,
  createTransactionValidator,
} from '../validators/transactions.validator';

const router = express.Router();

router.use(Authenticate);
router.use(validateCompany);
router.post('', createTransactionValidator, createTransactionController);
router.get('', getTransactionsController);
router.patch(
  '/refund/:id',
  createRefundTransactionValidator,
  refundTransactionController
);
router.get('/date', getTransactionsByDateController);
router.get('/:id', getTransactionsByIdController);
router.get('/customer/:id', getTransactionsByCustomerController);

export { router as TransactionRoute };
