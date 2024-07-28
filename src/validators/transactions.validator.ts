import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { AppError } from '../utility/AppError';
import {
  CreateTransaction,
  RefundTransaction,
} from '../dto/transactions/types';
import {
  CreateRefundTransactionValidationSchema,
  CreateTransactionValidationSchema,
} from '../dto/transactions';

export const createTransactionValidator = async (
  req: Request<any, any, CreateTransaction>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { customerId, items, methodOfPayment, typeOfTransaction, cashierId } =
      req.body;

    const transaction = new CreateTransactionValidationSchema();
    transaction.cashierId = cashierId;
    transaction.customerId = customerId;
    transaction.methodOfPayment = methodOfPayment;
    transaction.typeOfTransaction = typeOfTransaction;
    transaction.items = items;

    await validateOrReject(transaction);

    next();
  } catch (e: any) {
    console.log(e);
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};

export const createRefundTransactionValidator = async (
  req: Request<any, any, RefundTransaction>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { items, typeOfTransaction } = req.body;

    const transaction = new CreateRefundTransactionValidationSchema();
    transaction.typeOfTransaction = typeOfTransaction;
    transaction.items = items;

    await validateOrReject(transaction);

    next();
  } catch (e: any) {
    console.log(e);
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};
