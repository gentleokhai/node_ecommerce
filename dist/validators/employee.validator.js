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
exports.updateEmployeeStatusValidator = exports.updateEmployeeAccessValidator = exports.updateEmployeeValidator = exports.createEmployeeValidator = void 0;
const class_validator_1 = require("class-validator");
const employee_1 = require("../dto/employee");
const createEmployeeValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'Missing request body!' });
        }
        const { firstName, lastName, email, phoneNumber, company, dateOfEmployment, jobTitle, status, gender, accessType, } = req.body;
        const employee = new employee_1.CreateEmployeeValidationSchema();
        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.email = email;
        employee.phoneNumber = phoneNumber;
        employee.company = company;
        employee.dateOfEmployment = dateOfEmployment;
        employee.jobTitle = jobTitle;
        employee.status = status;
        employee.gender = gender;
        employee.accessType = accessType;
        yield (0, class_validator_1.validateOrReject)(employee);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.createEmployeeValidator = createEmployeeValidator;
const updateEmployeeValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'Missing request body!' });
        }
        const { firstName, lastName, email, phoneNumber, dateOfEmployment, jobTitle, gender, } = req.body;
        const employee = new employee_1.UpdateEmployeeValidationSchema();
        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.email = email;
        employee.phoneNumber = phoneNumber;
        employee.dateOfEmployment = dateOfEmployment;
        employee.jobTitle = jobTitle;
        employee.gender = gender;
        yield (0, class_validator_1.validateOrReject)(employee);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.updateEmployeeValidator = updateEmployeeValidator;
const updateEmployeeAccessValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'Missing request body!' });
        }
        const { accessType } = req.body;
        const employee = new employee_1.UpdateEmployeeAccessValidationSchema();
        employee.accessType = accessType;
        yield (0, class_validator_1.validateOrReject)(employee);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.updateEmployeeAccessValidator = updateEmployeeAccessValidator;
const updateEmployeeStatusValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'Missing request body!' });
        }
        const { status } = req.body;
        const employee = new employee_1.UpdateEmployeeStatusSchema();
        employee.status = status;
        yield (0, class_validator_1.validateOrReject)(employee);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.updateEmployeeStatusValidator = updateEmployeeStatusValidator;
