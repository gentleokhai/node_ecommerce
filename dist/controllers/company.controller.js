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
exports.updateSellingCurrencyController = exports.updateViewingCurrencyController = exports.getCompanyCurrenciesController = exports.getCompanyByIdController = exports.updateCompanyController = exports.createCompanyController = void 0;
const models_1 = require("../models");
const company_service_1 = require("../services/company.service");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const exchangeRates_model_1 = require("../models/exchangeRates.model");
exports.createCompanyController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.AppError('User information not found', 400);
    }
    const employee = yield models_1.Employee.findById(user.id);
    if (!employee) {
        throw new AppError_1.AppError('User not found', 400);
    }
    if (employee.company) {
        throw new AppError_1.AppError('User already has a company registered', 400);
    }
    const companyService = yield (0, company_service_1.createCompany)(req.body);
    yield models_1.Employee.findByIdAndUpdate(user.id, { company: companyService.id });
    res.status(201).json(companyService);
}));
exports.updateCompanyController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers['companyid'];
    if (!id) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const { businessName, businessType, industry, companySize, addressNumber, buyingCurrency, sellingCurrency, street, city, state, zipCode, } = req.body;
    const existingCompany = yield models_1.Company.findById(id);
    if (existingCompany !== null) {
        businessName && (existingCompany.businessName = businessName);
        businessType && (existingCompany.businessType = businessType);
        industry && (existingCompany.industry = industry);
        companySize && (existingCompany.companySize = companySize);
        addressNumber && (existingCompany.addressNumber = addressNumber);
        buyingCurrency && (existingCompany.buyingCurrency = buyingCurrency);
        sellingCurrency && (existingCompany.sellingCurrency = sellingCurrency);
        street && (existingCompany.street = street);
        city && (existingCompany.city = city);
        state && (existingCompany.state = state);
        zipCode && (existingCompany.zipCode = zipCode);
        yield existingCompany.save();
        return res.json({ message: 'Company updated!' });
    }
    throw new AppError_1.AppError('User information not found', 400);
}));
exports.getCompanyByIdController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers['companyid'];
    if (!id) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const company = yield models_1.Company.findById(id).select('-users');
    res.status(200).json(company);
}));
exports.getCompanyCurrenciesController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers['companyid'];
    if (!id) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const currencies = yield models_1.Company.findById(id).select('buyingCurrency sellingCurrency');
    res.status(200).json(currencies);
}));
exports.updateViewingCurrencyController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers['companyid'];
    if (!id) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const { viewingCurrency } = req.body;
    const existingCompany = yield models_1.Company.findById(id);
    const exchangeRate = yield exchangeRates_model_1.ExchangeRates.findOne({
        currencyCode: viewingCurrency,
    });
    if (!exchangeRate) {
        throw new AppError_1.AppError(`Exchange rate for ${viewingCurrency} not found`, 400);
    }
    if (existingCompany !== null) {
        existingCompany.viewingCurrency = viewingCurrency;
        yield existingCompany.save();
        return res.json({ message: 'Viewing currency updated!' });
    }
    throw new AppError_1.AppError('Company not found', 400);
}));
exports.updateSellingCurrencyController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers['companyid'];
    if (!id) {
        throw new AppError_1.AppError('Company ID is required in headers', 400);
    }
    const { sellingCurrency } = req.body;
    const existingCompany = yield models_1.Company.findById(id);
    const exchangeRate = yield exchangeRates_model_1.ExchangeRates.findOne({
        currencyCode: sellingCurrency,
    });
    if (!exchangeRate) {
        throw new AppError_1.AppError(`${sellingCurrency} not valid`, 400);
    }
    if (existingCompany !== null) {
        existingCompany.sellingCurrency = sellingCurrency;
        yield existingCompany.save();
        return res.json({ message: 'Selling currency updated!' });
    }
    throw new AppError_1.AppError('Company not found', 400);
}));
