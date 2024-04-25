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
exports.createOrUpdateEmployerValidator = void 0;
const class_validator_1 = require("class-validator");
const employer_1 = require("../dto/employer");
const AppError_1 = require("../utility/AppError");
const createOrUpdateEmployerValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { firstName, lastName, gender } = req.body;
        const employer = new employer_1.UpdateEmployerValidationSchema();
        employer.firstName = firstName;
        employer.lastName = lastName;
        employer.gender = gender;
        yield (0, class_validator_1.validateOrReject)(employer);
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
exports.createOrUpdateEmployerValidator = createOrUpdateEmployerValidator;
