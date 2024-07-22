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

const router = express.Router();

router.use(Authenticate);
router.post('', createTransactionController);
router.get('', getTransactionsController);
router.patch('/refund/:id', refundTransactionController);
router.get('/date', getTransactionsByDateController);
router.get('/:id', getTransactionsByIdController);
router.get('/customer/:id', getTransactionsByCustomerController);

export { router as TransactionRoute };
