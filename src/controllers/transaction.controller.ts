import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import { CreateTransaction } from '../dto/transactions/types';
import { Transactions } from '../models/transaction.model';
import { AppError } from '../utility/AppError';

export const createTransactionController = tryCatch(
  async (req: Request<any, any, CreateTransaction>, res: Response) => {
    const {
      customerId,
      items,
      methodOfPayment,
      typeOfTransaction,
      cashierId,
      amount,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Items array is required and cannot be empty', 400);
    }

    const transactions = await Transactions.create({
      customerId,
      items,
      methodOfPayment,
      typeOfTransaction,
      cashierId,
      amount,
    });

    res.status(201).json(transactions);
  }
);

export const getTransactionsController = tryCatch(
  async (req: Request, res: Response) => {
    const transactions = await Transactions.find();

    res.status(200).json(transactions);
  }
);
