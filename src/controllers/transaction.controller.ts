import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import {
  CreateTransaction,
  ItemStatus,
  RefundTransaction,
} from '../dto/transactions/types';
import { Transactions, TransactionsDoc } from '../models/transaction.model';
import { AppError } from '../utility/AppError';
import { Customer } from '../models/customer.model';
import Big from 'big.js';
import { Item } from '../models/items.model';
import mongoose from 'mongoose';
import { roundUp } from '../utility/helpers';
import {
  convertToCurrency,
  convertToUSD,
} from '../services/exchangeRate.service';

export const createTransactionController = tryCatch(
  async (req: Request<any, any, CreateTransaction>, res: Response) => {
    const { customerId, items, methodOfPayment, typeOfTransaction, cashierId } =
      req.body;

    const company = req.company;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Items array is required and cannot be empty', 400);
    }

    let totalAmount = new Big(0);
    for (const transactionItem of items) {
      const itemDetails = await Item.findById(transactionItem.item);
      if (!itemDetails) {
        throw new AppError(
          `Item with ID ${transactionItem.item} not found`,
          404
        );
      }
      const itemTotal = new Big(itemDetails.sellingPrice).times(
        transactionItem.numberOfItems
      );
      totalAmount = totalAmount.plus(itemTotal);
    }

    const viewingCurrency = company?.viewingCurrency ?? '';

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log('NGN Price', Number(totalAmount));

    try {
      let customer = await Customer.findById(customerId).session(session);

      const transactions = await Transactions.create(
        [
          {
            customer: customerId && customerId,
            items,
            methodOfPayment,
            typeOfTransaction,
            cashier: cashierId,
            amount: roundUp(Number(totalAmount)),
            company: company?._id,
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
        const amountSpent = new Big(totalAmount);

        if (typeOfTransaction === 'REFUND') {
          customer.totalSpend = roundUp(
            await convertToUSD(
              parseFloat(existingTotalSpend.minus(amountSpent).toString()),
              viewingCurrency
            )
          );
        } else {
          customer.totalSpend = roundUp(
            await convertToUSD(
              parseFloat(existingTotalSpend.plus(amountSpent).toString()),
              viewingCurrency
            )
          );
        }

        await customer.save({ session });
      } else {
        console.log('Customer not found');
      }

      for (const transactionItem of items) {
        const item = await Item.findById(transactionItem.item).session(session);

        if (item) {
          const remainingStock = item.stock;
          item.stock -= transactionItem.numberOfItems;

          if (item.stock < 0) {
            throw new AppError(
              `Insufficient stock for item: ${item.name}, remaining stock ${remainingStock}`,
              400
            );
          }

          await item.save({ session });
        } else {
          throw new AppError(
            `Item with ID ${transactionItem.item} not found`,
            404
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
    const company = req.company;

    const viewingCurrency = company?.viewingCurrency || 'USD';

    const transactions = await Transactions.find({
      company: company?._id,
    })
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
          path: 'items.item',
          select: 'image name sellingPrice',
        },
      ])
      .sort('-createdAt');

    const convertedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const convertedItems = await Promise.all(
          transaction.items.map(async (item: any) => {
            if (item?.item) {
              const convertedPrice = roundUp(
                await convertToCurrency(
                  item.item.sellingPrice as number,
                  viewingCurrency
                )
              );

              return {
                ...item.toObject(),
                item: {
                  ...item.item.toObject(),
                  sellingPrice: convertedPrice,
                },
              };
            }

            return {
              ...item.toObject(),
              item: null,
            };
          })
        );

        return {
          ...transaction.toObject(),
          items: convertedItems,
          amount: roundUp(
            await convertToCurrency(Number(transaction.amount), viewingCurrency)
          ),
        };
      })
    );

    res.status(200).json(convertedTransactions);
  }
);

export const getTransactionsByDateController = tryCatch(
  async (req: Request, res: Response) => {
    const company = req.company;

    const viewingCurrency = company?.viewingCurrency || 'USD';

    const transactions = await Transactions.find({
      company: company?._id,
    })
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
          path: 'items.item',
          select: 'image name sellingPrice',
        },
      ])
      .sort('-createdAt');

    const convertedTransactions = await Promise.all(
      transactions.map(async (transaction): Promise<typeof transaction> => {
        const convertedItems = await Promise.all(
          transaction.items.map(async (item: any) => {
            if (item?.item) {
              const convertedPrice = roundUp(
                await convertToCurrency(
                  item.item.sellingPrice as number,
                  viewingCurrency
                )
              );

              return {
                ...item.toObject(),
                item: {
                  ...item.item.toObject(),
                  sellingPrice: convertedPrice,
                },
                id: item._id.toString(),
              };
            }

            return {
              ...item.toObject(),
              item: null,
              id: item._id.toString(),
            };
          })
        );

        return {
          ...transaction.toObject(),
          items: convertedItems,
          amount: roundUp(
            await convertToCurrency(Number(transaction.amount), viewingCurrency)
          ),
        };
      })
    );

    const transactionsByDate = convertedTransactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const dateKey = transactionDate.toISOString().split('T')[0];

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].push(transaction);

        return acc;
      },
      {} as Record<string, any[]>
    );

    res.status(200).json(transactionsByDate);
  }
);

export const getTransactionsByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const company = req.company;

    const viewingCurrency = company?.viewingCurrency || 'USD';

    const transaction = await Transactions.findOne({
      company: company?._id,
      _id: transactionId,
    }).populate([
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

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    const convertedItems = await Promise.all(
      transaction.items.map(async (item: any) => {
        if (item?.item) {
          const convertedPrice = roundUp(
            await convertToCurrency(
              item.item.sellingPrice as number,
              viewingCurrency
            )
          );

          return {
            ...item.toObject(),
            item: {
              ...item.item.toObject(),
              sellingPrice: convertedPrice,
            },
          };
        }

        return {
          ...item.toObject(),
          item: null,
        };
      })
    );

    const convertedTransaction = {
      ...transaction.toObject(),
      items: convertedItems,
      amount: roundUp(
        await convertToCurrency(Number(transaction.amount), viewingCurrency)
      ),
    };

    res.status(200).json(convertedTransaction);
  }
);

export const getTransactionsByCustomerController = tryCatch(
  async (req: Request, res: Response) => {
    const customer = req.params.id;
    const company = req.company;

    const viewingCurrency = company?.viewingCurrency || 'USD';

    const transactions = await Transactions.find({
      customer,
      company: company?._id,
    }).populate([
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

    const convertedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const convertedItems = await Promise.all(
          transaction.items.map(async (item: any) => {
            if (item?.item) {
              const convertedPrice = roundUp(
                await convertToCurrency(
                  item.item.sellingPrice as number,
                  viewingCurrency
                )
              );

              return {
                ...item.toObject(),
                item: {
                  ...item.item.toObject(),
                  sellingPrice: convertedPrice,
                },
                id: item._id.toString(),
              };
            }

            return {
              ...item.toObject(),
              item: null,
              id: item._id.toString(),
            };
          })
        );

        return {
          ...transaction.toObject(),
          items: convertedItems,
          amount: roundUp(
            await convertToCurrency(Number(transaction.amount), viewingCurrency)
          ),
        };
      })
    );

    res.status(200).json(convertedTransactions);
  }
);

export const refundTransactionController = tryCatch(
  async (req: Request<any, any, RefundTransaction>, res: Response) => {
    const { items, typeOfTransaction } = req.body;

    const company = req.company;

    const transactionId = req.params.id;
    const existingTransaction = await Transactions.findById(transactionId);

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Items array is required and cannot be empty', 400);
    }

    let totalRefundAmount = new Big(0);
    for (const transactionItem of items) {
      const itemDetails = await Item.findById(transactionItem.item);
      if (!itemDetails) {
        throw new AppError(
          `Item with ID ${transactionItem.item} not found`,
          404
        );
      }
      const itemTotal = new Big(itemDetails.sellingPrice).times(
        transactionItem.numberOfItems
      );
      totalRefundAmount = totalRefundAmount.plus(itemTotal);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let customer = await Customer.findById(
        existingTransaction?.customer
      ).session(session);

      if (customer) {
        if (!customer.firstVisited) {
          customer.firstVisited = new Date();
        }
        customer.lastVisited = new Date();

        const existingTotalSpend = new Big(customer.totalSpend ?? 0);
        const amountSpent = new Big(totalRefundAmount);

        if (typeOfTransaction === 'REFUND') {
          customer.totalSpend = roundUp(
            parseFloat(existingTotalSpend.minus(amountSpent).toString())
          );
        }

        await customer.save({ session });
      } else {
        console.log('Customer not found');
      }

      if (existingTransaction?.items) {
        const newRefundItems = [];

        for (const transactionItem of existingTransaction.items) {
          const matchingItem = items.find(
            (i) => i.item === transactionItem.item.toString()
          );

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

          if (matchingItem) {
            transactionItem.numberOfItems -= matchingItem.numberOfItems;

            newRefundItems.push({
              item: matchingItem.item,
              numberOfItems: matchingItem.numberOfItems,
              status: 'REFUNDED' as ItemStatus,
            });
          }
        }

        existingTransaction.items.push(...newRefundItems);

        existingTransaction.save();
      }

      await Transactions.create(
        [
          {
            customer: existingTransaction?.customer,
            items,
            methodOfPayment: existingTransaction?.methodOfPayment,
            typeOfTransaction,
            cashier: existingTransaction?.cashier,
            amount: Number(totalRefundAmount),
            company: company?._id,
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
