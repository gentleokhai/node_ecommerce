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
exports.createOrUpdateUserValidator = void 0;
const class_validator_1 = require("class-validator");
const user_1 = require("../dto/user");
const createOrUpdateUserValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'Missing request body!' });
        }
        const data = new user_1.UpdateUserValidationSchema(req.body.email, req.body.phoneNumber, req.body.password, req.body.firstName, req.body.lastName, req.body.title, req.body.role, req.body.gender);
        yield (0, class_validator_1.validateOrReject)(data);
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
exports.createOrUpdateUserValidator = createOrUpdateUserValidator;
