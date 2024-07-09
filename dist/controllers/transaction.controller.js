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
exports.getTransactionsByCustomerController = exports.getTransactionsByIdController = exports.getTransactionsController = exports.createTransactionController = void 0;
const tryCatch_1 = require("../utility/tryCatch");
const transaction_model_1 = require("../models/transaction.model");
const AppError_1 = require("../utility/AppError");
const customer_model_1 = require("../models/customer.model");
const big_js_1 = __importDefault(require("big.js"));
exports.createTransactionController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { customerId, items, methodOfPayment, typeOfTransaction, cashierId, amount, } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_1.AppError('Items array is required and cannot be empty', 400);
    }
    let customer = yield customer_model_1.Customer.findById(customerId);
    const transactions = yield transaction_model_1.Transactions.create({
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
        const existingTotalSpend = new big_js_1.default((_a = customer.totalSpend) !== null && _a !== void 0 ? _a : 0);
        const amountSpent = new big_js_1.default(amount);
        customer.totalSpend = parseFloat(existingTotalSpend.plus(amountSpent).toFixed(2));
        yield customer.save();
    }
    else {
        console.log('Customer not found');
    }
    res.status(201).json(transactions);
}));
exports.getTransactionsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transactions.find().populate([
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
