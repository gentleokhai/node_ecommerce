"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeStatusSchema = exports.UpdateEmployeeAccessValidationSchema = exports.UpdateEmployeeValidationSchema = exports.CreateEmployeeValidationSchema = void 0;
const class_validator_1 = require("class-validator");
const general_1 = require("../general");
class CreateEmployeeValidationSchema {
}
exports.CreateEmployeeValidationSchema = CreateEmployeeValidationSchema;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateEmployeeValidationSchema.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateEmployeeValidationSchema.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateEmployeeValidationSchema.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateEmployeeValidationSchema.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateEmployeeValidationSchema.prototype, "jobTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateEmployeeValidationSchema.prototype, "dateOfEmployment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, general_1.IsEnumValue)(general_1.Status)
], CreateEmployeeValidationSchema.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Validate)(general_1.IsValidMongoId)
], CreateEmployeeValidationSchema.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, general_1.IsEnumValue)(general_1.AccessType)
], CreateEmployeeValidationSchema.prototype, "accessType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, general_1.IsEnumValue)(general_1.Gender)
], CreateEmployeeValidationSchema.prototype, "gender", void 0);
class UpdateEmployeeValidationSchema {
}
exports.UpdateEmployeeValidationSchema = UpdateEmployeeValidationSchema;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdateEmployeeValidationSchema.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdateEmployeeValidationSchema.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdateEmployeeValidationSchema.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdateEmployeeValidationSchema.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdateEmployeeValidationSchema.prototype, "jobTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdateEmployeeValidationSchema.prototype, "dateOfEmployment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Validate)(general_1.IsValidMongoId)
], UpdateEmployeeValidationSchema.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, general_1.IsEnumValue)(general_1.Gender)
], UpdateEmployeeValidationSchema.prototype, "gender", void 0);
class UpdateEmployeeAccessValidationSchema {
}
exports.UpdateEmployeeAccessValidationSchema = UpdateEmployeeAccessValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, general_1.IsEnumValue)(general_1.AccessType)
], UpdateEmployeeAccessValidationSchema.prototype, "accessType", void 0);
class UpdateEmployeeStatusSchema {
}
exports.UpdateEmployeeStatusSchema = UpdateEmployeeStatusSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, general_1.IsEnumValue)(general_1.Status)
], UpdateEmployeeStatusSchema.prototype, "status", void 0);
