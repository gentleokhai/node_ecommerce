import express from 'express';
import {
  createTransactionController,
  getTransactionsByCustomerController,
  getTransactionsController,
} from '../controllers/transaction.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.use(Authenticate);
router.post('', createTransactionController);
router.get('', getTransactionsController);
router.get('/:id', getTransactionsByCustomerController);

export { router as TransactionRoute };
