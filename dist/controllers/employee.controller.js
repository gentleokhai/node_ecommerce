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
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const FindEmployee = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Employee.findOne({ email: email });
    }
    else {
        return yield models_1.Employee.findById(id).select('-password -salt');
    }
});
exports.FindEmployee = FindEmployee;
exports.createEmployeeController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existingUser = yield (0, exports.FindEmployee)('', email);
    if (existingUser !== null)
        throw new AppError_1.AppError('An account already exists with this email', 400);
    const createEmployeeService = yield (0, services_1.createEmployee)(req.body);
    res.status(201).json(createEmployeeService);
}));
exports.updateEmployeeController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, jobTitle, dateOfEmployment, phoneNumber, } = req.body;
    const id = req.params.id;
    const existingEmployee = yield (0, exports.FindEmployee)(id);
    if (!existingEmployee) {
        throw new AppError_1.AppError('Employee does not exist', 400);
    }
    existingEmployee.firstName = firstName;
    existingEmployee.lastName = lastName;
    existingEmployee.gender = gender;
    existingEmployee.jobTitle = jobTitle;
    existingEmployee.dateOfEmployment = dateOfEmployment;
    existingEmployee.phoneNumber = phoneNumber;
    const updatedEmployee = yield existingEmployee.save();
    res.json(updatedEmployee);
}));
exports.getEmployeesController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, sortOptions } = (0, filters_1.getEmployeesFilter)(req);
    const page = parseInt(req.query.page, 10) || 1;
    const pagePerLimit = parseInt(req.query.pagePerLimit, 10) || 10;
    const startIndex = (page - 1) * pagePerLimit;
    const endIndex = page * pagePerLimit;
    const employees = yield models_1.Employee.find(query)
        .sort(sortOptions)
        .select('-password -salt')
        .populate('jobTitle');
    const paginatedEmployees = employees.slice(startIndex, endIndex);
    const totalPages = Math.ceil(employees.length / pagePerLimit);
    const totalEmployees = employees.length - 1;
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    const currentPage = page;
    res.status(200).json({
        result: paginatedEmployees,
        totalPages,
        pagePerLimit,
        totalEmployees,
        nextPage,
        previousPage,
        currentPage,
    });
}));
exports.getEmployeeByIdController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const employee = yield models_1.Employee.findById(id)
        .select('-password -salt')
        .populate('jobTitle')
        .populate({
        path: 'company',
        select: 'businessName industry id',
    });
    res.status(200).json(employee);
}));
exports.updateEmployeeAccessController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessType } = req.body;
    const id = req.params.id;
    const existingEmployee = yield (0, exports.FindEmployee)(id);
    if (!existingEmployee) {
        throw new AppError_1.AppError('Employee does not exist', 400);
    }
    existingEmployee.accessType = accessType;
    yield existingEmployee.save();
    return res.json(existingEmployee);
}));
exports.updateEmployeeStatusController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status } = req.body;
    const existingEmployee = yield (0, exports.FindEmployee)(id);
    if (!existingEmployee) {
        throw new AppError_1.AppError('Employee does not exist', 400);
    }
    existingEmployee.status = status;
    yield existingEmployee.save();
    return res.json(existingEmployee);
}));
