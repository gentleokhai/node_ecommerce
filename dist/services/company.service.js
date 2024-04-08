"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = void 0;
const models_1 = require("../models");
const createCompany = (data) => {
    const createdCompany = models_1.Company.create(data);
    return createdCompany;
};
exports.createCompany = createCompany;
