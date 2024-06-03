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
exports.login = exports.signup = void 0;
const models_1 = require("../models");
const jobs_model_1 = require("../models/jobs.model");
const utility_1 = require("../utility");
const signup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phoneNumber } = data;
    const salt = yield (0, utility_1.GenerateSalt)();
    const accountPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    let ownerJob = yield jobs_model_1.Jobs.findOne({ name: 'Owner' });
    if (!ownerJob) {
        ownerJob = yield jobs_model_1.Jobs.create({ name: 'Owner' });
    }
    const createdEmployee = yield models_1.Employee.create({
        email,
        password: accountPassword,
        phoneNumber,
        salt,
        accessType: 'EXECUTIVE',
        status: 'ACTIVE',
        jobTitle: ownerJob.id,
    });
    const signature = (0, utility_1.GenerateSignature)({
        id: createdEmployee.id,
        email: email,
    });
    const result = {
        id: createdEmployee.id,
        email: email,
        token: signature,
        accessType: createdEmployee.accessType,
    };
    return result;
});
exports.signup = signup;
const login = (data, existingUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = data;
    const validation = yield (0, utility_1.ValidatePassword)(password, existingUser.password, existingUser.salt);
    if (validation) {
        const signature = (0, utility_1.GenerateSignature)({
            id: existingUser.id,
            email: existingUser.email,
        });
        return { token: signature, isValidated: true };
    }
    return { isValidated: false };
});
exports.login = login;
