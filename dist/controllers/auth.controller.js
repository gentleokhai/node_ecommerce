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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordController = exports.changePasswordController = exports.loginController = exports.signupController = void 0;
const models_1 = require("../models");
const services_1 = require("../services");
const AppError_1 = require("../utility/AppError");
const tryCatch_1 = require("../utility/tryCatch");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const utility_1 = require("../utility");
const general_1 = require("../dto/general");
const generate_token_1 = require("../utility/generate-token");
const mailer_1 = __importDefault(require("../utility/mailer"));
dotenv_1.default.config();
const findEmployee = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Employee.findOne({ email: email });
    }
    else {
        return yield models_1.Employee.findOne({ id: id });
    }
});
exports.signupController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmployee = yield findEmployee('', req.body.email);
    if (existingEmployee !== null)
        throw new AppError_1.AppError('An account already exists with this email', 400);
    const signupService = yield (0, services_1.signup)(req.body);
    return res.status(201).json(signupService);
}));
exports.loginController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmployee = yield findEmployee('', req.body.email);
    if (existingEmployee !== null) {
        const loginService = yield (0, services_1.login)(req.body, {
            id: existingEmployee.id,
            email: existingEmployee.email,
            password: existingEmployee.password,
            salt: existingEmployee.salt,
        });
        if (loginService.isValidated) {
            res
                .status(200)
                .json({
                token: loginService.token,
                accessType: existingEmployee.accessType,
            });
        }
        else {
            throw new AppError_1.AppError('Login credentials are not valid', 400);
        }
    }
    else {
        throw new AppError_1.AppError('Login credentials are not valid', 400);
    }
}));
exports.changePasswordController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        throw new AppError_1.AppError('Passwords do not match', 400);
    }
    if (!token) {
        throw new AppError_1.AppError('Invalid token', 400);
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        throw new AppError_1.AppError('Invalid or expired token', 400);
    }
    const employee = yield models_1.Employee.findOne({ email: decoded.email });
    if (!employee) {
        throw new AppError_1.AppError('Invalid token or user not found', 400);
    }
    if (employee.tokenExpiration && employee.tokenExpiration < new Date()) {
        throw new AppError_1.AppError('Token has expired', 400);
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const accountPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    employee.verified = true;
    employee.verificationToken = undefined;
    employee.tokenExpiration = undefined;
    employee.password = accountPassword;
    employee.status = general_1.Status.ACTIVE;
    employee.salt = salt;
    yield employee.save();
    res.status(200).json({ message: 'Password Created' });
}));
exports.forgotPasswordController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existingEmployee = yield models_1.Employee.findOne({ email: email });
    const token = (0, generate_token_1.generateToken)(email);
    const verificationLink = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;
    if (existingEmployee) {
        existingEmployee.verificationToken = token;
        existingEmployee.tokenExpiration = new Date(Date.now() + 3600000);
        yield (0, mailer_1.default)({
            to: existingEmployee.email,
            from: 'Uche from Zulu',
            subject: 'ZULU RESET PASSWORD',
            template: 'forgotPassword',
            verificationLink,
        }).catch((error) => {
            console.log(error);
            throw new AppError_1.AppError('Failed to send email. Please try again later.', 500);
        });
        res.status(200).json({ message: 'Email Sent' });
    }
    else {
        res.status(200).json({ message: 'Email Sent' });
    }
}));
