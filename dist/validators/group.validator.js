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
exports.createGroupValidator = void 0;
const class_validator_1 = require("class-validator");
const group_1 = require("../dto/group");
const AppError_1 = require("../utility/AppError");
const createGroupValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { name } = req.body;
        const group = new group_1.CreateGroupValidationSchema();
        group.name = name;
        yield (0, class_validator_1.validateOrReject)(group);
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
exports.createGroupValidator = createGroupValidator;
