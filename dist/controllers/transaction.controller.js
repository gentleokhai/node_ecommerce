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
const helpers_1 = require("../utility/helpers");
const exchangeRate_service_1 = require("../services/exchangeRate.service");
const models_1 = require("../models");
exports.createTransactionController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { customerId, items, methodOfPayment, typeOfTransaction, cashierId } = req.body;
    const companyId = req.headers['companyid'];
    if (!companyId) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const company = yield models_1.Company.findById(companyId);
    if (!company) {
        throw new AppError_1.AppError('Company not found', 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_1.AppError('Items array is required and cannot be empty', 400);
    }
    let totalAmount = new big_js_1.default(0);
    for (const transactionItem of items) {
        const itemDetails = yield items_model_1.Item.findById(transactionItem.item);
        if (!itemDetails) {
            throw new AppError_1.AppError(`Item with ID ${transactionItem.item} not found`, 404);
        }
        const itemTotal = new big_js_1.default(itemDetails.sellingPrice).times(transactionItem.numberOfItems);
        totalAmount = totalAmount.plus(itemTotal);
    }
    const viewingCurrency = 'USD';
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let customer = yield customer_model_1.Customer.findById(customerId).session(session);
        const transactions = yield transaction_model_1.Transactions.create([
            {
                customer: customerId && customerId,
                items,
                methodOfPayment,
                typeOfTransaction,
                cashier: cashierId,
                amount: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(Number(totalAmount), viewingCurrency)),
            },
        ], { session });
        if (customer) {
            if (!customer.firstVisited) {
                customer.firstVisited = new Date();
            }
            customer.lastVisited = new Date();
            const existingTotalSpend = new big_js_1.default((_a = customer.totalSpend) !== null && _a !== void 0 ? _a : 0);
            const amountSpent = new big_js_1.default(totalAmount);
            if (typeOfTransaction === 'REFUND') {
                customer.totalSpend = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(parseFloat(existingTotalSpend.minus(amountSpent).toString()), viewingCurrency));
            }
            else {
                customer.totalSpend = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(parseFloat(existingTotalSpend.plus(amountSpent).toString()), viewingCurrency));
            }
            yield customer.save({ session });
        }
        else {
            console.log('Customer not found');
        }
        for (const transactionItem of items) {
            const item = yield items_model_1.Item.findById(transactionItem.item).session(session);
            if (item) {
                const remainingStock = item.stock;
                item.stock -= transactionItem.numberOfItems;
                if (item.stock < 0) {
                    throw new AppError_1.AppError(`Insufficient stock for item: ${item.name}, remaining stock ${remainingStock}`, 400);
                }
                yield item.save({ session });
            }
            else {
                throw new AppError_1.AppError(`Item with ID ${transactionItem.item} not found`, 404);
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
    const companyId = req.headers['companyid'];
    if (!companyId) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const company = yield models_1.Company.findById(companyId);
    if (!company) {
        throw new AppError_1.AppError('Company not found', 400);
    }
    const viewingCurrency = company.viewingCurrency || 'USD';
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
            path: 'items.item',
            select: 'image name sellingPrice',
        },
    ])
        .sort('-createdAt');
    const convertedTransactions = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const convertedItems = yield Promise.all(transaction.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item === null || item === void 0 ? void 0 : item.item) {
                const convertedPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.item.sellingPrice, viewingCurrency));
                return Object.assign(Object.assign({}, item.toObject()), { item: Object.assign(Object.assign({}, item.item.toObject()), { sellingPrice: convertedPrice }) });
            }
            return Object.assign(Object.assign({}, item.toObject()), { item: null });
        })));
        return Object.assign(Object.assign({}, transaction.toObject()), { items: convertedItems, amount: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(Number(transaction.amount), viewingCurrency)) });
    })));
    res.status(200).json(convertedTransactions);
}));
exports.getTransactionsByDateController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.headers['companyid'];
    if (!companyId) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const company = yield models_1.Company.findById(companyId);
    if (!company) {
        throw new AppError_1.AppError('Company not found', 400);
    }
    const viewingCurrency = company.viewingCurrency || 'USD';
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
            path: 'items.item',
            select: 'image name sellingPrice',
        },
    ])
        .sort('-createdAt');
    const convertedTransactions = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const convertedItems = yield Promise.all(transaction.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item === null || item === void 0 ? void 0 : item.item) {
                const convertedPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.item.sellingPrice, viewingCurrency));
                return Object.assign(Object.assign({}, item.toObject()), { item: Object.assign(Object.assign({}, item.item.toObject()), { sellingPrice: convertedPrice }) });
            }
            return Object.assign(Object.assign({}, item.toObject()), { item: null });
        })));
        return Object.assign(Object.assign({}, transaction.toObject()), { items: convertedItems, amount: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(Number(transaction.amount), viewingCurrency)) });
    })));
    const transactionsByDate = convertedTransactions.reduce((acc, transaction) => {
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
    const companyId = req.headers['companyid'];
    if (!companyId) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const company = yield models_1.Company.findById(companyId);
    if (!company) {
        throw new AppError_1.AppError('Company not found', 400);
    }
    const viewingCurrency = company.viewingCurrency || 'USD';
    const transaction = yield transaction_model_1.Transactions.findById(transactionId).populate([
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
        throw new AppError_1.AppError('Transaction not found', 404);
    }
    const convertedItems = yield Promise.all(transaction.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        if (item === null || item === void 0 ? void 0 : item.item) {
            const convertedPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.item.sellingPrice, viewingCurrency));
            return Object.assign(Object.assign({}, item.toObject()), { item: Object.assign(Object.assign({}, item.item.toObject()), { sellingPrice: convertedPrice }) });
        }
        return Object.assign(Object.assign({}, item.toObject()), { item: null });
    })));
    const convertedTransaction = Object.assign(Object.assign({}, transaction.toObject()), { items: convertedItems, amount: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(Number(transaction.amount), viewingCurrency)) });
    res.status(200).json(convertedTransaction);
}));
exports.getTransactionsByCustomerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.params.id;
    const companyId = req.headers['companyid'];
    if (!companyId) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const company = yield models_1.Company.findById(companyId);
    if (!company) {
        throw new AppError_1.AppError('Company not found', 400);
    }
    const viewingCurrency = company.viewingCurrency || 'USD';
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
    const convertedTransactions = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const convertedItems = yield Promise.all(transaction.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item === null || item === void 0 ? void 0 : item.item) {
                const convertedPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.item.sellingPrice, viewingCurrency));
                return Object.assign(Object.assign({}, item.toObject()), { item: Object.assign(Object.assign({}, item.item.toObject()), { sellingPrice: convertedPrice }) });
            }
            return Object.assign(Object.assign({}, item.toObject()), { item: null });
        })));
        return Object.assign(Object.assign({}, transaction.toObject()), { items: convertedItems, amount: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(Number(transaction.amount), viewingCurrency)) });
    })));
    res.status(200).json(convertedTransactions);
}));
exports.refundTransactionController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { items, typeOfTransaction } = req.body;
    const transactionId = req.params.id;
    const existingTransaction = yield transaction_model_1.Transactions.findById(transactionId);
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_1.AppError('Items array is required and cannot be empty', 400);
    }
    let totalRefundAmount = new big_js_1.default(0);
    for (const transactionItem of items) {
        const itemDetails = yield items_model_1.Item.findById(transactionItem.item);
        if (!itemDetails) {
            throw new AppError_1.AppError(`Item with ID ${transactionItem.item} not found`, 404);
        }
        const itemTotal = new big_js_1.default(itemDetails.sellingPrice).times(transactionItem.numberOfItems);
        totalRefundAmount = totalRefundAmount.plus(itemTotal);
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let customer = yield customer_model_1.Customer.findById(existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.customer).session(session);
        if (customer) {
            if (!customer.firstVisited) {
                customer.firstVisited = new Date();
            }
            customer.lastVisited = new Date();
            const existingTotalSpend = new big_js_1.default((_b = customer.totalSpend) !== null && _b !== void 0 ? _b : 0);
            const amountSpent = new big_js_1.default(totalRefundAmount);
            if (typeOfTransaction === 'REFUND') {
                customer.totalSpend = (0, helpers_1.roundUp)(parseFloat(existingTotalSpend.minus(amountSpent).toString()));
            }
            yield customer.save({ session });
        }
        else {
            console.log('Customer not found');
        }
        if (existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.items) {
            const newRefundItems = [];
            for (const transactionItem of existingTransaction.items) {
                const matchingItem = items.find((i) => i.item === transactionItem.item.toString());
                if (matchingItem &&
                    Number(matchingItem.numberOfItems) >
                        Number(transactionItem.numberOfItems)) {
                    const itemName = yield items_model_1.Item.findById(transactionItem.item);
                    throw new AppError_1.AppError(`Number of ${itemName === null || itemName === void 0 ? void 0 : itemName.name} cannot be more than initial purchase`, 400);
                }
                if (matchingItem) {
                    transactionItem.numberOfItems -= matchingItem.numberOfItems;
                    newRefundItems.push({
                        item: matchingItem.item,
                        numberOfItems: matchingItem.numberOfItems,
                        status: 'REFUNDED',
                    });
                }
            }
            existingTransaction.items.push(...newRefundItems);
            existingTransaction.save();
        }
        yield transaction_model_1.Transactions.create([
            {
                customer: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.customer,
                items,
                methodOfPayment: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.methodOfPayment,
                typeOfTransaction,
                cashier: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.cashier,
                amount: Number(totalRefundAmount),
            },
        ], { session });
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
