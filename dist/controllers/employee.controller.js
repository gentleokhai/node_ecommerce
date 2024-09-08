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
exports.updateEmployeeStatusController = exports.updateEmployeeAccessController = exports.getEmployeeByIdController = exports.getEmployeesController = exports.updateEmployeeOnboardingController = exports.updateEmployeeController = exports.getMeController = exports.createEmployeeController = exports.FindEmployee = void 0;
const filters_1 = require("../dto/employee/filters");
const models_1 = require("../models");
const services_1 = require("../services");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const mailer_1 = __importDefault(require("../utility/mailer"));
const generate_token_1 = require("../utility/generate-token");
const dotenv_1 = __importDefault(require("dotenv"));
const general_1 = require("../dto/general");
dotenv_1.default.config();
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
    const company = req.company;
    const existingUser = yield models_1.Employee.findOne({
        email: email,
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    if (existingUser !== null)
        throw new AppError_1.AppError('An account already exists with this email', 400);
    const employee = yield (0, services_1.createEmployee)(Object.assign(Object.assign({}, req.body), { company: company === null || company === void 0 ? void 0 : company._id }));
    const token = (0, generate_token_1.generateToken)(email);
    employee.verificationToken = token;
    employee.tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now
    yield employee.save();
    const verificationLink = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;
    if (employee.accessType !== general_1.AccessType.NOACCESS) {
        yield (0, mailer_1.default)({
            to: employee.email,
            from: 'Uche from Zulu',
            subject: 'ZULU ACCOUNT ACTIVATION',
            template: 'email',
            firstName: employee.firstName,
            verificationLink,
        }).catch((error) => {
            console.log(error);
            throw new AppError_1.AppError('Failed to send verification email. Please try again later.', 500);
        });
        employee.status = general_1.Status.INVITED;
        yield employee.save();
    }
    else {
        employee.status = general_1.Status.ACTIVE;
        yield employee.save();
    }
    res.status(201).json(employee);
}));
exports.getMeController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const employee = yield (0, exports.FindEmployee)(user === null || user === void 0 ? void 0 : user.id);
        if (employee) {
            return res.status(200).json(employee);
        }
        else {
            throw new AppError_1.AppError('User information not found', 400);
        }
    }
    throw new AppError_1.AppError('User information not found', 400);
}));
exports.updateEmployeeController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, jobTitle, dateOfEmployment, phoneNumber, } = req.body;
    const id = req.params.id;
    const existingEmployee = yield (0, exports.FindEmployee)(id);
    if (!existingEmployee) {
        throw new AppError_1.AppError('Employee does not exist', 400);
    }
    firstName && (existingEmployee.firstName = firstName);
    lastName && (existingEmployee.lastName = lastName);
    gender && (existingEmployee.gender = gender);
    jobTitle && (existingEmployee.jobTitle = jobTitle);
    dateOfEmployment && (existingEmployee.dateOfEmployment = dateOfEmployment);
    phoneNumber && (existingEmployee.phoneNumber = phoneNumber);
    yield existingEmployee.save();
    res.json({ message: 'Employee updated' });
}));
exports.updateEmployeeOnboardingController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender } = (req.body);
    const user = req.user;
    const existingUser = yield (0, exports.FindEmployee)(user === null || user === void 0 ? void 0 : user.id);
    if (existingUser !== null) {
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.gender = gender;
        yield existingUser.save();
        return res.json(existingUser);
    }
    throw new AppError_1.AppError('User information not found', 400);
}));
exports.getEmployeesController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, sortOptions } = (0, filters_1.getEmployeesFilter)(req);
    const company = req.company;
    const page = parseInt(req.query.page, 10) || 1;
    const pagePerLimit = parseInt(req.query.pagePerLimit, 10) || 10;
    const startIndex = (page - 1) * pagePerLimit;
    const endIndex = page * pagePerLimit;
    const employees = yield models_1.Employee.find(Object.assign(Object.assign({}, query), { company: company === null || company === void 0 ? void 0 : company._id }))
        .sort(sortOptions)
        .select('-password -salt -tokenExpiration -verificationToken')
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
    const company = req.company;
    const employee = yield models_1.Employee.findOne({
        _id: id,
        company: company === null || company === void 0 ? void 0 : company._id,
    })
        .select('-password -salt -tokenExpiration -verificationToken')
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
