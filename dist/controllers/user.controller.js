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
exports.associateUserWithCompany = exports.updateUserController = exports.CreateUser = exports.FindUser = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const FindUser = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.User.findOne({ email: email });
    }
    else {
        return yield models_1.User.findOne({ id: id });
    }
});
exports.FindUser = FindUser;
const CreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phoneNumber, firstName, lastName, gender, role } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield (0, exports.FindUser)('', email);
        if (existingUser !== null)
            return res.json({ message: 'An account already exists with this email' });
        const salt = yield (0, utility_1.GenerateSalt)();
        const accountPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        yield models_1.User.create({
            email,
            password: accountPassword,
            phoneNumber,
            firstName,
            salt,
            lastName,
            gender,
            role,
        });
        const result = {
            email,
            firstName,
            lastName,
            gender,
            role,
            phoneNumber,
        };
        return res.json(result);
    }
});
exports.CreateUser = CreateUser;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, firstName, lastName, gender, role } = req.body;
    const user = req.user;
    if (user) {
        try {
            const existingUser = yield (0, exports.FindUser)(user === null || user === void 0 ? void 0 : user.id);
            if (existingUser !== null) {
                existingUser.firstName = firstName;
                existingUser.lastName = lastName;
                // existingUser.email = email;
                // existingUser.phoneNumber = phoneNumber;
                existingUser.gender = gender;
                existingUser.role = role;
                yield existingUser.save();
                const result = {
                    firstName,
                    lastName,
                    email,
                    gender,
                    role,
                    phoneNumber,
                };
                return res.json(result);
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    return res.status(400).json({ message: 'User information not found' });
});
exports.updateUserController = updateUserController;
const associateUserWithCompany = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.User.findByIdAndUpdate(userId, { company: companyId });
    }
    catch (err) {
        throw err;
    }
});
exports.associateUserWithCompany = associateUserWithCompany;
