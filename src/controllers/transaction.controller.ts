import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import {
  CreateTransaction,
  RefundTransaction,
} from '../dto/transactions/types';
import { Transactions } from '../models/transaction.model';
import { AppError } from '../utility/AppError';
import { Customer } from '../models/customer.model';
import Big from 'big.js';
import { Item } from '../models/items.model';
import mongoose from 'mongoose';

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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let customer = await Customer.findById(customerId).session(session);

      const transactions = await Transactions.create(
        [
          {
            customer: customerId,
            items,
            methodOfPayment,
            typeOfTransaction,
            cashier: cashierId,
            amount,
          },
        ],
        { session }
      );

      if (customer) {
        if (!customer.firstVisited) {
          customer.firstVisited = new Date();
        }
        customer.lastVisited = new Date();

        const existingTotalSpend = new Big(customer.totalSpend ?? 0);
        const amountSpent = new Big(amount);

        if (typeOfTransaction === 'REFUND') {
          customer.totalSpend = parseFloat(
            existingTotalSpend.minus(amountSpent).toFixed(2)
          );
        } else {
          customer.totalSpend = parseFloat(
            existingTotalSpend.plus(amountSpent).toFixed(2)
          );
        }

        await customer.save({ session });
      } else {
        console.log('Customer not found');
      }

      for (const transactionItem of items) {
        const item = await Item.findById(transactionItem.item).session(session);

        if (item) {
          item.stock -= transactionItem.numberOfItems;

          if (item.stock < 0) {
            throw new AppError(
              `Insufficient stock for item: ${item.name}`,
              400
            );
          }

          await item.save({ session });
        } else {
          throw new AppError(
            `Item with ID ${transactionItem.item} not found`,
            400
          );
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(transactions);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
);

export const getTransactionsController = tryCatch(
  async (req: Request, res: Response) => {
    const transactions = await Transactions.find()
      .populate([
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
      ])
      .sort('-createdAt');

    res.status(200).json(transactions);
  }
);

export const getTransactionsByDateController = tryCatch(
  async (req: Request, res: Response) => {
    const transactions = await Transactions.find()
      .populate([
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
      ])
      .sort('-createdAt');

    const transactionsByDate = transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const dateKey = transactionDate.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(transaction);

      return acc;
    }, {} as any);

    res.status(200).json(transactionsByDate);
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

export const refundTransactionController = tryCatch(
  async (req: Request<any, any, RefundTransaction>, res: Response) => {
    const { customerId, items, typeOfTransaction, amount } = req.body;

    const transactionId = req.params.id;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Items array is required and cannot be empty', 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let customer = await Customer.findById(customerId).session(session);

      const existingTransaction = await Transactions.findById(transactionId);

      if (customer) {
        if (!customer.firstVisited) {
          customer.firstVisited = new Date();
        }
        customer.lastVisited = new Date();

        const existingTotalSpend = new Big(customer.totalSpend ?? 0);
        const amountSpent = new Big(amount);

        if (typeOfTransaction === 'REFUND') {
          customer.totalSpend = parseFloat(
            existingTotalSpend.minus(amountSpent).toFixed(2)
          );
        }

        await customer.save({ session });
      } else {
        console.log('Customer not found');
      }

      if (existingTransaction?.items) {
        for (const transactionItem of existingTransaction.items) {
          const matchingItem = items.find(
            (i) => i.item === transactionItem.item.toString()
          );

          if (matchingItem) {
            transactionItem.status = 'REFUNDED';
          }

          if (
            matchingItem &&
            Number(matchingItem.numberOfItems) >
              Number(transactionItem.numberOfItems)
          ) {
            const itemName = await Item.findById(transactionItem.item);
            throw new AppError(
              `Number of ${itemName?.name} cannot be more than initial purchase`,
              400
            );
          }
        }

        existingTransaction.save();
      }

      await Transactions.create(
        [
          {
            customer: customerId,
            items,
            methodOfPayment: existingTransaction?.methodOfPayment,
            typeOfTransaction,
            cashier: existingTransaction?.cashier,
            amount,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: 'Items Refunded' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
);
