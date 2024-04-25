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
exports.createItemValidator = void 0;
const class_validator_1 = require("class-validator");
const item_dto_1 = require("../dto/item/item.dto");
const AppError_1 = require("../utility/AppError");
const createItemValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new AppError_1.AppError('Missing request body!', 400);
        }
        const { image, name, category, unit, sku, weight, currency, description, costPrice, sellingPrice, wholesalePrice, quantityInPack, stock, lowStock, } = req.body;
        const item = new item_dto_1.CreateItemValidationSchema();
        item.image = image !== null && image !== void 0 ? image : '';
        item.name = name;
        item.category = category;
        item.sku = sku;
        item.weight = weight;
        item.currency = currency;
        item.unit = unit;
        item.description = description;
        item.costPrice = costPrice;
        item.sellingPrice = sellingPrice;
        item.wholesalePrice = wholesalePrice;
        item.quantityInPack = quantityInPack;
        item.stock = stock;
        item.lowStock = lowStock;
        yield (0, class_validator_1.validateOrReject)(item);
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
exports.createItemValidator = createItemValidator;
