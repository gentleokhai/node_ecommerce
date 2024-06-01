"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordValidationSchema = exports.LoginValidationSchema = exports.SignupValidationSchema = void 0;
const class_validator_1 = require("class-validator");
class SignupValidationSchema {
    constructor(email, phoneNumber, password) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}
exports.SignupValidationSchema = SignupValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], SignupValidationSchema.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)()
], SignupValidationSchema.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], SignupValidationSchema.prototype, "password", void 0);
class LoginValidationSchema {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.LoginValidationSchema = LoginValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], LoginValidationSchema.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], LoginValidationSchema.prototype, "password", void 0);
class ChangePasswordValidationSchema {
    constructor(confirmPassword, password) {
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}
exports.ChangePasswordValidationSchema = ChangePasswordValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], ChangePasswordValidationSchema.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], ChangePasswordValidationSchema.prototype, "confirmPassword", void 0);
