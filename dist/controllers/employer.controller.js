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
exports.updateEmployerController = exports.getEmployerController = exports.FindEmployer = void 0;
const models_1 = require("../models");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const FindEmployer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Employer.findOne({ email: email });
    }
    else {
        return yield models_1.Employer.findById(id).select('-password -salt');
    }
});
exports.FindEmployer = FindEmployer;
exports.getEmployerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const employer = yield (0, exports.FindEmployer)(user === null || user === void 0 ? void 0 : user.id);
        if (employer) {
            return res.status(200).json(employer);
        }
        else {
            throw new AppError_1.AppError('User information not found', 400);
        }
    }
    throw new AppError_1.AppError('User information not found', 400);
}));
exports.updateEmployerController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender } = req.body;
    const user = req.user;
    const existingUser = yield (0, exports.FindEmployer)(user === null || user === void 0 ? void 0 : user.id);
    if (existingUser !== null) {
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.gender = gender;
        yield existingUser.save();
        return res.json(existingUser);
    }
    throw new AppError_1.AppError('User information not found', 400);
}));
