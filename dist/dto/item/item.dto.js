"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestockItemStockValidationSchema = exports.UpdateItemStockValidationSchema = exports.UpdateItemPriceValidationSchema = exports.UpdateItemValidationSchema = exports.CreateItemValidationSchema = void 0;
const class_validator_1 = require("class-validator");
const general_1 = require("../general");
class CreateItemValidationSchema {
}
exports.CreateItemValidationSchema = CreateItemValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Validate)(general_1.IsValidMongoId)
], CreateItemValidationSchema.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.IsOptional)()
], CreateItemValidationSchema.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], CreateItemValidationSchema.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "costPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "sellingPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)()
], CreateItemValidationSchema.prototype, "wholesalePrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
    }),
    (0, class_validator_1.IsInt)({ message: 'quantity in pack must be a whole number.' }),
    (0, class_validator_1.IsOptional)()
], CreateItemValidationSchema.prototype, "quantityInPack", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
    }),
    (0, class_validator_1.IsInt)({ message: 'stock must be a whole number.' }),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
    }),
    (0, class_validator_1.IsInt)({ message: 'low stock must be a whole number.' }),
    (0, class_validator_1.IsNotEmpty)()
], CreateItemValidationSchema.prototype, "lowStock", void 0);
class UpdateItemValidationSchema {
}
exports.UpdateItemValidationSchema = UpdateItemValidationSchema;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], UpdateItemValidationSchema.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], UpdateItemValidationSchema.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(general_1.IsValidMongoId)
], UpdateItemValidationSchema.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], UpdateItemValidationSchema.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], UpdateItemValidationSchema.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.IsOptional)()
], UpdateItemValidationSchema.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], UpdateItemValidationSchema.prototype, "description", void 0);
class UpdateItemPriceValidationSchema {
}
exports.UpdateItemPriceValidationSchema = UpdateItemPriceValidationSchema;
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.IsOptional)()
], UpdateItemPriceValidationSchema.prototype, "costPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.IsOptional)()
], UpdateItemPriceValidationSchema.prototype, "sellingPrice", void 0);
class UpdateItemStockValidationSchema {
}
exports.UpdateItemStockValidationSchema = UpdateItemStockValidationSchema;
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
    }),
    (0, class_validator_1.IsInt)({ message: 'stock must be a whole number.' }),
    (0, class_validator_1.IsOptional)()
], UpdateItemStockValidationSchema.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
    }),
    (0, class_validator_1.IsInt)({ message: 'low stock must be a whole number.' }),
    (0, class_validator_1.IsOptional)()
], UpdateItemStockValidationSchema.prototype, "lowStock", void 0);
class RestockItemStockValidationSchema {
}
exports.RestockItemStockValidationSchema = RestockItemStockValidationSchema;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)()
], RestockItemStockValidationSchema.prototype, "items", void 0);
