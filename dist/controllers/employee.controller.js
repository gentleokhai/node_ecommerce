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
exports.updateEmployeeStatusController = exports.updateEmployeeAccessController = exports.getEmployeeByIdController = exports.getEmployeesController = exports.updateEmployeeController = exports.createEmployeeController = exports.FindEmployee = void 0;
const filters_1 = require("../dto/employee/filters");
const models_1 = require("../models");
const services_1 = require("../services");
const FindEmployee = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Employee.findOne({ email: email });
    }
    else {
        return yield models_1.Employee.findById(id).select('-password -salt');
    }
});
exports.FindEmployee = FindEmployee;
const createEmployeeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existingUser = yield (0, exports.FindEmployee)('', email);
    if (existingUser !== null)
        return res.json({ message: 'An account already exists with this email' });
    const createEmployeeService = yield (0, services_1.createEmployee)(req.body);
    res.status(201).json(createEmployeeService);
});
exports.createEmployeeController = createEmployeeController;
const updateEmployeeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, jobTitle, dateOfEmployment, phoneNumber, } = req.body;
    const id = req.params.id;
    try {
        const existingEmployee = yield (0, exports.FindEmployee)(id);
        if (existingEmployee !== null) {
            existingEmployee.firstName = firstName;
            existingEmployee.lastName = lastName;
            existingEmployee.gender = gender;
            existingEmployee.jobTitle = jobTitle;
            existingEmployee.dateOfEmployment = dateOfEmployment;
            existingEmployee.phoneNumber = phoneNumber;
            yield existingEmployee.save();
            return res.json(existingEmployee);
        }
        else {
            return res.status(400).json({ message: 'Employee does not exist' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateEmployeeController = updateEmployeeController;
const getEmployeesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, sortOptions } = (0, filters_1.getEmployeesFilter)(req);
    try {
        const employees = yield models_1.Employee.find(query)
            .sort(sortOptions)
            .select('-password -salt')
            .populate('jobTitle');
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});
exports.getEmployeesController = getEmployeesController;
const getEmployeeByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const employee = yield models_1.Employee.findById(id)
            .select('-password -salt')
            .populate('jobTitle')
            .populate({
            path: 'company',
            select: 'businessName industry id',
        });
        res.status(200).json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});
exports.getEmployeeByIdController = getEmployeeByIdController;
const updateEmployeeAccessController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessType } = req.body;
    const id = req.params.id;
    try {
        const existingEmployee = yield (0, exports.FindEmployee)(id);
        if (existingEmployee !== null) {
            existingEmployee.accessType = accessType;
            yield existingEmployee.save();
            return res.json(existingEmployee);
        }
        else {
            return res.status(400).json({ message: 'Employee does not exist' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateEmployeeAccessController = updateEmployeeAccessController;
const updateEmployeeStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status } = req.body;
    try {
        const existingEmployee = yield (0, exports.FindEmployee)(id);
        if (existingEmployee !== null) {
            existingEmployee.status = status;
            yield existingEmployee.save();
            return res.json(existingEmployee);
        }
        else {
            return res.status(400).json({ message: 'Employee does not exist' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateEmployeeStatusController = updateEmployeeStatusController;
