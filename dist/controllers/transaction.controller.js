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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsController = exports.createTransactionController = void 0;
const tryCatch_1 = require("../utility/tryCatch");
const transaction_model_1 = require("../models/transaction.model");
const AppError_1 = require("../utility/AppError");
exports.createTransactionController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, items, methodOfPayment, typeOfTransaction, cashierId, amount, } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_1.AppError('Items array is required and cannot be empty', 400);
    }
    const transactions = yield transaction_model_1.Transactions.create({
        customerId,
        items,
        methodOfPayment,
        typeOfTransaction,
        cashierId,
        amount,
    });
    res.status(201).json(transactions);
}));
exports.getTransactionsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transactions.find();
    res.status(200).json(transactions);
}));
