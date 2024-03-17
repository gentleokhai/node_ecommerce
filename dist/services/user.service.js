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
exports.updateUser = exports.createUser = exports.FindUser = void 0;
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
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phoneNumber, firstName, lastName, gender, role } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield (0, exports.FindUser)('', email);
        if (existingUser !== null)
            return res.json({ message: 'An account already exists with this email' });
        const salt = yield (0, utility_1.GenerateSalt)();
        const accountPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        const createdUser = yield models_1.User.create({
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
            id: createdUser.id,
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
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, firstName, lastName, gender, role } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield (0, exports.FindUser)(user.id);
        if (existingUser !== null) {
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.email = email;
            existingUser.phoneNumber = phoneNumber;
            existingUser.gender = gender;
            existingUser.role = role;
            const savedResult = existingUser.save();
            return res.json(savedResult);
        }
    }
    return res.json({ message: 'User information not found' });
});
exports.updateUser = updateUser;
