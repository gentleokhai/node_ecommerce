"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = void 0;
const models_1 = require("../models");
const createCompany = (data) => {
    const { businessName, businessType, industry, companySize, addressNumber, buyingCurrency, sellingCurrency, street, city, state, zipCode, } = data;
    const createdCompany = models_1.Company.create({
        businessName,
        businessType,
        industry,
        companySize,
        addressNumber,
        buyingCurrency,
        sellingCurrency,
        street,
        city,
        state,
        zipCode,
    });
    return createdCompany;
};
exports.createCompany = createCompany;
