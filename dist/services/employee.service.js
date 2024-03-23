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
exports.createEmployee = exports.FindEmployee = void 0;
const models_1 = require("../models");
const FindEmployee = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Employee.findOne({ email: email });
    }
    else {
        return yield models_1.Employee.findOne({ id: id });
    }
});
exports.FindEmployee = FindEmployee;
const createEmployee = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, firstName, lastName, gender, accessType, jobTitle, status, dateOfEmployment, company, } = data;
    const createdUser = yield models_1.Employee.create({
        email,
        phoneNumber,
        firstName,
        lastName,
        gender,
        accessType,
        jobTitle,
        dateOfEmployment,
        company,
        status,
    });
    const result = {
        id: createdUser.id,
        email,
        firstName,
        lastName,
        status,
        gender,
        accessType,
        phoneNumber,
        jobTitle,
        company,
        dateOfEmployment,
    };
    return result;
});
exports.createEmployee = createEmployee;
