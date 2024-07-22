"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundTransactionController = exports.getTransactionsByCustomerController = exports.getTransactionsByIdController = exports.getTransactionsByDateController = exports.getTransactionsController = exports.createTransactionController = void 0;
const tryCatch_1 = require("../utility/tryCatch");
const transaction_model_1 = require("../models/transaction.model");
const AppError_1 = require("../utility/AppError");
const customer_model_1 = require("../models/customer.model");
const big_js_1 = __importDefault(require("big.js"));
const items_model_1 = require("../models/items.model");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createTransactionController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { customerId, items, methodOfPayment, typeOfTransaction, cashierId, amount, } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_1.AppError('Items array is required and cannot be empty', 400);
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let customer = yield customer_model_1.Customer.findById(customerId).session(session);
        const transactions = yield transaction_model_1.Transactions.create([
            {
                customer: customerId,
                items,
                methodOfPayment,
                typeOfTransaction,
                cashier: cashierId,
                amount,
            },
        ], { session });
        if (customer) {
            if (!customer.firstVisited) {
                customer.firstVisited = new Date();
            }
            customer.lastVisited = new Date();
            const existingTotalSpend = new big_js_1.default((_a = customer.totalSpend) !== null && _a !== void 0 ? _a : 0);
            const amountSpent = new big_js_1.default(amount);
            if (typeOfTransaction === 'REFUND') {
                customer.totalSpend = parseFloat(existingTotalSpend.minus(amountSpent).toFixed(2));
            }
            else {
                customer.totalSpend = parseFloat(existingTotalSpend.plus(amountSpent).toFixed(2));
            }
            yield customer.save({ session });
        }
        else {
            console.log('Customer not found');
        }
        for (const transactionItem of items) {
            const item = yield items_model_1.Item.findById(transactionItem.item).session(session);
            if (item) {
                item.stock -= transactionItem.numberOfItems;
                if (item.stock < 0) {
                    throw new AppError_1.AppError(`Insufficient stock for item: ${item.name}`, 400);
                }
                yield item.save({ session });
            }
            else {
                throw new AppError_1.AppError(`Item with ID ${transactionItem.item} not found`, 400);
            }
        }
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json(transactions);
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
}));
exports.getTransactionsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transactions.find()
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
}));
exports.getTransactionsByDateController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transactions.find()
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
    }, {});
    res.status(200).json(transactionsByDate);
}));
exports.getTransactionsByIdController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.params.id;
    const transactions = yield transaction_model_1.Transactions.findById(transactionId).populate([
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
}));
exports.getTransactionsByCustomerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.params.id;
    const transactions = yield transaction_model_1.Transactions.find({ customer }).populate([
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
}));
exports.refundTransactionController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { customerId, items, typeOfTransaction, amount } = req.body;
    const transactionId = req.params.id;
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_1.AppError('Items array is required and cannot be empty', 400);
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let customer = yield customer_model_1.Customer.findById(customerId).session(session);
        const existingTransaction = yield transaction_model_1.Transactions.findById(transactionId);
        if (customer) {
            if (!customer.firstVisited) {
                customer.firstVisited = new Date();
            }
            customer.lastVisited = new Date();
            const existingTotalSpend = new big_js_1.default((_b = customer.totalSpend) !== null && _b !== void 0 ? _b : 0);
            const amountSpent = new big_js_1.default(amount);
            if (typeOfTransaction === 'REFUND') {
                customer.totalSpend = parseFloat(existingTotalSpend.minus(amountSpent).toFixed(2));
            }
            yield customer.save({ session });
        }
        else {
            console.log('Customer not found');
        }
        if (existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.items) {
            for (const transactionItem of existingTransaction.items) {
                const matchingItem = items.find((i) => i.item === transactionItem.item.toString());
                if (matchingItem) {
                    transactionItem.status = 'REFUNDED';
                }
            }
            existingTransaction.save();
        }
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Items Refunded' });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
}));
