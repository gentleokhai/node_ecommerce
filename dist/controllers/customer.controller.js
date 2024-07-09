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
exports.deleteNotesController = exports.updateNotesController = exports.createNotesController = exports.deleteCustomerController = exports.getCustomerByIdController = exports.getCustomersController = exports.updateCustomerController = exports.createCustomerController = exports.FindCustomer = void 0;
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const customer_model_1 = require("../models/customer.model");
const filters_1 = require("../dto/customer/filters");
const notes_model_1 = require("../models/notes.model");
const FindCustomer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield customer_model_1.Customer.findOne({ email: email });
    }
    else {
        return yield customer_model_1.Customer.findById(id);
    }
});
exports.FindCustomer = FindCustomer;
exports.createCustomerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, phoneNumber, firstName, lastName, gender, group } = req.body;
    const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const existingUser = yield (0, exports.FindCustomer)('', email);
    if (existingUser !== null)
        throw new AppError_1.AppError('A customer already exists with this email', 400);
    const createdCustomer = yield customer_model_1.Customer.create({
        email,
        phoneNumber,
        firstName,
        lastName,
        gender,
        createdBy: employeeId,
        group,
    });
    res.status(201).json(createdCustomer);
}));
exports.updateCustomerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, firstName, lastName, gender, group } = req.body;
    const id = req.params.id;
    const existingCustomer = yield (0, exports.FindCustomer)(id);
    if (!existingCustomer)
        throw new AppError_1.AppError('Customer does not exist', 400);
    existingCustomer.firstName = firstName;
    existingCustomer.lastName = lastName;
    existingCustomer.email = email;
    existingCustomer.phoneNumber = phoneNumber;
    existingCustomer.gender = gender;
    existingCustomer.group = group;
    const updateCustomer = yield existingCustomer.save();
    res.status(201).json(updateCustomer);
}));
exports.getCustomersController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = (0, filters_1.getCustomersFilter)(req);
    const customers = yield customer_model_1.Customer.find(query)
        .populate([
        {
            path: 'createdBy',
            select: 'firstName lastName id',
        },
        {
            path: 'group',
            select: 'name id',
        },
        {
            path: 'notes',
            select: 'note createdBy createdAt',
            populate: [
                {
                    path: 'createdBy',
                    select: 'firstName lastName id',
                },
            ],
        },
    ])
        .sort('-createdAt');
    res.status(200).json(customers);
}));
exports.getCustomerByIdController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customer = yield customer_model_1.Customer.findById(id).populate([
        {
            path: 'createdBy',
            select: 'firstName lastName id',
        },
        {
            path: 'group',
            select: 'name id',
        },
        {
            path: 'notes',
            select: 'note createdBy createdAt',
            populate: [
                {
                    path: 'createdBy',
                    select: 'firstName lastName id',
                },
            ],
        },
    ]);
    res.status(200).json(customer);
}));
exports.deleteCustomerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield customer_model_1.Customer.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new AppError_1.AppError('Customer does not exist', 400);
    }
    return res.status(200).json({ message: 'Customer deleted successfully' });
}));
exports.createNotesController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { note } = req.body;
    const employeeId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const id = req.params.id;
    const newNote = yield notes_model_1.Notes.create({
        note: note,
        createdBy: employeeId,
    });
    const existingCustomer = yield (0, exports.FindCustomer)(id);
    if (existingCustomer) {
        existingCustomer.notes.push(newNote._id);
        existingCustomer.save();
    }
    res.status(201).json(newNote);
}));
exports.updateNotesController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { note } = req.body;
    const id = req.params.id;
    const existingNote = yield notes_model_1.Notes.findById(id);
    if (!existingNote)
        throw new AppError_1.AppError('Note does not exist', 400);
    existingNote.note = note;
    const updatedNote = yield existingNote.save();
    res.status(201).json(updatedNote);
}));
exports.deleteNotesController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield notes_model_1.Notes.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new AppError_1.AppError('Note does not exist', 400);
    }
    return res.status(200).json({ message: 'Note deleted successfully' });
}));
