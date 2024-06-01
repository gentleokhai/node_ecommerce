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
exports.getCustomersController = exports.createCustomerController = exports.FindCustomer = void 0;
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const customer_model_1 = require("../models/customer.model");
const filters_1 = require("../dto/customer/filters");
const FindCustomer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield customer_model_1.Customer.findOne({ email: email });
    }
    else {
        return yield customer_model_1.Customer.findById(id);
    }
});
exports.FindCustomer = FindCustomer;
exports.createCustomerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, firstName, lastName, gender } = req.body;
    const existingUser = yield (0, exports.FindCustomer)('', email);
    if (existingUser !== null)
        throw new AppError_1.AppError('A customer already exists with this email', 400);
    const createdCustomer = yield customer_model_1.Customer.create({
        email,
        phoneNumber,
        firstName,
        lastName,
        gender,
    });
    res.status(201).json(createdCustomer);
}));
exports.getCustomersController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = (0, filters_1.getCustomersFilter)(req);
    const customers = yield customer_model_1.Customer.find(query);
    res.status(200).json(customers);
}));
