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
exports.createCompanyController = void 0;
const models_1 = require("../models");
const company_service_1 = require("../services/company.service");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
exports.createCompanyController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.AppError('User information not found', 400);
    }
    const employer = yield models_1.Employer.findById(user.id);
    if (!employer) {
        throw new AppError_1.AppError('Employer not found', 400);
    }
    if (employer.company) {
        throw new AppError_1.AppError('Employer already has a company registered', 400);
    }
    const companyService = yield (0, company_service_1.createCompany)(req.body);
    yield models_1.Employer.findByIdAndUpdate(user.id, { company: companyService.id });
    res.status(201).json(companyService);
}));
