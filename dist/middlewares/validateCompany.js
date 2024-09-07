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
exports.validateCompany = void 0;
const models_1 = require("../models");
const AppError_1 = require("../utility/AppError");
const validateCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.headers['companyid'];
    if (!companyId) {
        return next(new AppError_1.AppError('Company ID is required in headers', 400));
    }
    const company = yield models_1.Company.findById(companyId);
    if (!company) {
        return next(new AppError_1.AppError('Company not found', 400));
    }
    req.company = company;
    next();
});
exports.validateCompany = validateCompany;
