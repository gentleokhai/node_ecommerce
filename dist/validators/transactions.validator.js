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
exports.createRefundTransactionValidator = exports.createTransactionValidator = void 0;
const class_validator_1 = require("class-validator");
const AppError_1 = require("../utility/AppError");
const transactions_1 = require("../dto/transactions");
const createTransactionValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { customerId, items, methodOfPayment, typeOfTransaction, cashierId } = req.body;
        const transaction = new transactions_1.CreateTransactionValidationSchema();
        transaction.cashierId = cashierId;
        transaction.customerId = customerId;
        transaction.methodOfPayment = methodOfPayment;
        transaction.typeOfTransaction = typeOfTransaction;
        transaction.items = items;
        yield (0, class_validator_1.validateOrReject)(transaction);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.createTransactionValidator = createTransactionValidator;
const createRefundTransactionValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { items, typeOfTransaction } = req.body;
        const transaction = new transactions_1.CreateRefundTransactionValidationSchema();
        transaction.typeOfTransaction = typeOfTransaction;
        transaction.items = items;
        yield (0, class_validator_1.validateOrReject)(transaction);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.createRefundTransactionValidator = createRefundTransactionValidator;
