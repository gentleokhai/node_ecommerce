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
exports.updateCompanyValidator = exports.createCompanyValidator = void 0;
const class_validator_1 = require("class-validator");
const company_1 = require("../dto/company");
const AppError_1 = require("../utility/AppError");
const createCompanyValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { businessName, businessType, industry, companySize, addressNumber, buyingCurrency, sellingCurrency, street, city, state, zipCode, } = req.body;
        const company = new company_1.CreateCompanyValidationSchema();
        company.businessName = businessName;
        company.businessType = businessType;
        company.industry = industry;
        company.companySize = companySize;
        company.addressNumber = addressNumber;
        company.buyingCurrency = buyingCurrency;
        company.sellingCurrency = sellingCurrency;
        company.street = street;
        company.city = city;
        company.state = state;
        company.zipCode = zipCode;
        yield (0, class_validator_1.validateOrReject)(company);
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
exports.createCompanyValidator = createCompanyValidator;
const updateCompanyValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { businessName, businessType, industry, companySize, addressNumber, buyingCurrency, sellingCurrency, street, city, state, zipCode, } = req.body;
        const company = new company_1.UpdateCompanyValidationSchema();
        company.businessName = businessName;
        company.businessType = businessType;
        company.industry = industry;
        company.companySize = companySize;
        company.addressNumber = addressNumber;
        company.buyingCurrency = buyingCurrency;
        company.sellingCurrency = sellingCurrency;
        company.street = street;
        company.city = city;
        company.state = state;
        company.zipCode = zipCode;
        yield (0, class_validator_1.validateOrReject)(company);
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
exports.updateCompanyValidator = updateCompanyValidator;
