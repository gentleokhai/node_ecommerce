"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRefundTransactionValidationSchema = exports.CreateTransactionValidationSchema = void 0;
const class_validator_1 = require("class-validator");
const general_1 = require("../general");
class CreateTransactionValidationSchema {
}
exports.CreateTransactionValidationSchema = CreateTransactionValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(general_1.IsValidMongoId)
], CreateTransactionValidationSchema.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateTransactionValidationSchema.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateTransactionValidationSchema.prototype, "methodOfPayment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateTransactionValidationSchema.prototype, "cashierId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateTransactionValidationSchema.prototype, "typeOfTransaction", void 0);
class CreateRefundTransactionValidationSchema {
}
exports.CreateRefundTransactionValidationSchema = CreateRefundTransactionValidationSchema;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateRefundTransactionValidationSchema.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateRefundTransactionValidationSchema.prototype, "typeOfTransaction", void 0);
