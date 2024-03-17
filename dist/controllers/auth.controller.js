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
const findUser = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.User.findOne({ email: email });
    }
    else {
        return yield models_1.User.findOne({ id: id });
    }
});
const signupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield findUser('', req.body.email);
    if (existingUser !== null)
        return res
            .status(400)
            .json({ message: 'An account already exists with this email' });
    const signupService = yield (0, services_1.signup)(req.body);
    return res.status(201).json(signupService);
});
exports.signupController = signupController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield findUser('', req.body.email);
    if (existingUser !== null) {
        const loginService = yield (0, services_1.login)(req.body, {
            id: existingUser.id,
            email: existingUser.email,
            password: existingUser.password,
            salt: existingUser.salt,
        });
        if (loginService.isValidated) {
            return res.status(200).json({ token: loginService.token });
        }
        return res.status(400).json({ message: 'Login credentials are not valid' });
    }
    return res.status(400).json({ message: 'Login credentials are not valid' });
});
exports.loginController = loginController;
