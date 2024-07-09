import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import { CreateTransaction } from '../dto/transactions/types';
import { Transactions } from '../models/transaction.model';
import { AppError } from '../utility/AppError';
import { Customer } from '../models/customer.model';
import Big from 'big.js';

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

    let customer = await Customer.findById(customerId);

    const transactions = await Transactions.create({
      customer: customerId,
      items,
      methodOfPayment,
      typeOfTransaction,
      cashier: cashierId,
      amount,
    });

    if (customer) {
      if (!customer.firstVisited) {
        customer.firstVisited = new Date();
      }
      customer.lastVisited = new Date();

      const existingTotalSpend = new Big(customer.totalSpend ?? 0);
      const amountSpent = new Big(amount);

      customer.totalSpend = parseFloat(
        existingTotalSpend.plus(amountSpent).toFixed(2)
      );

      await customer.save();
    } else {
      console.log('Customer not found');
    }

    res.status(201).json(transactions);
  }
);

export const getTransactionsController = tryCatch(
  async (req: Request, res: Response) => {
    const transactions = await Transactions.find().populate([
      {
        path: 'cashier',
        select: 'firstName lastName id',
      },
      {
        path: 'customer',
        select: 'firstName lastName id',
      },
      {
        path: 'items',
        populate: {
          path: 'item',
          select: 'image name sellingPrice',
        },
        select: 'firstName lastName id',
      },
    ]);

    res.status(200).json(transactions);
  }
);

export const getTransactionsByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const transactions = await Transactions.findById(transactionId).populate([
      {
        path: 'cashier',
        select: 'firstName lastName id',
      },
      {
        path: 'customer',
        select: 'firstName lastName id',
      },
      {
        path: 'items',
        populate: {
          path: 'item',
          select: 'image name sellingPrice',
        },
        select: 'firstName lastName id',
      },
    ]);

    res.status(200).json(transactions);
  }
);

export const getTransactionsByCustomerController = tryCatch(
  async (req: Request, res: Response) => {
    const customer = req.params.id;
    const transactions = await Transactions.find({ customer }).populate([
      {
        path: 'cashier',
        select: 'firstName lastName id',
      },
      {
        path: 'customer',
        select: 'firstName lastName id',
      },
      {
        path: 'items',
        populate: {
          path: 'item',
          select: 'image name sellingPrice',
        },
        select: 'firstName lastName id',
      },
    ]);

    res.status(200).json(transactions);
  }
);
