import express from 'express';
import {
  createTransactionController,
  getTransactionsController,
} from '../controllers/transaction.controller';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.use(Authenticate);
router.post('', createTransactionController);
router.get('', getTransactionsController);

export { router as TransactionRoute };
