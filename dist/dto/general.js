"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEnumValue = exports.IsValidMongoId = exports.Status = exports.AccessType = exports.Gender = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHERS"] = "OTHERS";
})(Gender || (exports.Gender = Gender = {}));
var AccessType;
(function (AccessType) {
    AccessType["NOACCESS"] = "NOACCESS";
    AccessType["CASHIER"] = "CASHIER";
    AccessType["MANAGER"] = "MANAGER";
    AccessType["EXECUTIVE"] = "EXECUTIVE";
})(AccessType || (exports.AccessType = AccessType = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["DEACTIVATED"] = "DEACTIVATED";
    Status["INVITED"] = "INVITED";
})(Status || (exports.Status = Status = {}));
let IsValidMongoId = class IsValidMongoId {
    validate(id, args) {
        return mongoose_1.Types.ObjectId.isValid(id);
    }
    defaultMessage(args) {
        return `${args.property} must be a valid MongoDB ObjectID`;
    }
};
exports.IsValidMongoId = IsValidMongoId;
exports.IsValidMongoId = IsValidMongoId = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidMongoId', async: false })
], IsValidMongoId);
function IsEnumValue(enumType, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isEnumValue',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    return Object.values(enumType).includes(value);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid enum value`;
                },
            },
        });
    };
}
exports.IsEnumValue = IsEnumValue;
