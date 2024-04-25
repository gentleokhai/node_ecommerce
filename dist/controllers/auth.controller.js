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
exports.loginController = exports.signupController = void 0;
const models_1 = require("../models");
const services_1 = require("../services");
const AppError_1 = require("../utility/AppError");
const tryCatch_1 = require("../utility/tryCatch");
const findEmployer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Employer.findOne({ email: email });
    }
    else {
        return yield models_1.Employer.findOne({ id: id });
    }
});
exports.signupController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmployer = yield findEmployer('', req.body.email);
    if (existingEmployer !== null)
        throw new AppError_1.AppError('An account already exists with this email', 400);
    const signupService = yield (0, services_1.signup)(req.body);
    return res.status(201).json(signupService);
}));
exports.loginController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmployer = yield findEmployer('', req.body.email);
    if (existingEmployer !== null) {
        const loginService = yield (0, services_1.login)(req.body, {
            id: existingEmployer.id,
            email: existingEmployer.email,
            password: existingEmployer.password,
            salt: existingEmployer.salt,
        });
        if (loginService.isValidated) {
            res.status(200).json({ token: loginService.token });
            return;
        }
        throw new AppError_1.AppError('Login credentials are not valid', 400);
    }
    throw new AppError_1.AppError('Login credentials are not valid', 400);
}));
