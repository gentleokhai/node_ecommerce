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
const company_service_1 = require("../services/company.service");
const user_controller_1 = require("./user.controller");
const createCompanyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const companyService = yield (0, company_service_1.createCompany)(req.body);
        yield (0, user_controller_1.associateUserWithCompany)(companyService.id, user.id);
        return res.status(201).json(companyService);
    }
    return res.json({ message: 'User information not found' });
});
exports.createCompanyController = createCompanyController;
