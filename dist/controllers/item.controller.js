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
exports.updateItemStockController = exports.updateItemPriceController = exports.getItemByIdController = exports.getItemsController = exports.createItemController = void 0;
const cloudinary_1 = require("../config/cloudinary");
const filters_1 = require("../dto/item/filters");
const items_model_1 = require("../models/items.model");
const item_service_1 = require("../services/item.service");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
exports.createItemController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, category, unit, sku, weight, description, currency, costPrice, sellingPrice, wholesalePrice, quantityInPack, stock, lowStock, } = req.body;
    const existingItem = yield items_model_1.Item.findOne({ name: name });
    if (existingItem !== null)
        throw new AppError_1.AppError('An item already exists with this name', 400);
    const buffer = Buffer.from(image !== null && image !== void 0 ? image : '', 'base64');
    const uploader = (path) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_1.upload)(path, 'Zulu', res); });
    const cloudImage = yield uploader(buffer);
    const createItemService = yield (0, item_service_1.createItem)({
        image: cloudImage.url,
        name,
        category,
        unit,
        sku,
        weight,
        description,
        currency,
        costPrice,
        sellingPrice,
        wholesalePrice,
        quantityInPack,
        stock,
        lowStock,
    });
    res.status(201).json(createItemService);
}));
exports.getItemsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, sortOptions } = (0, filters_1.getItemsFilter)(req);
    const items = yield items_model_1.Item.find(query).sort(sortOptions).populate('category');
    res.status(200).json(items);
}));
exports.getItemByIdController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const item = yield items_model_1.Item.findById(id);
    res.status(200).json(item);
}));
exports.updateItemPriceController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { costPrice, sellingPrice } = req.body;
    const id = req.params.id;
    const existingItem = yield items_model_1.Item.findById(id);
    if (existingItem !== null) {
        existingItem.costPrice = costPrice;
        existingItem.sellingPrice = sellingPrice;
        yield existingItem.save();
        return res.json(existingItem);
    }
    else {
        throw new AppError_1.AppError('Item does not exist', 400);
    }
}));
exports.updateItemStockController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stock, lowStock } = req.body;
    const id = req.params.id;
    const existingItem = yield items_model_1.Item.findById(id);
    if (existingItem !== null) {
        existingItem.stock = stock;
        existingItem.lowStock = lowStock;
        yield existingItem.save();
        return res.json(existingItem);
    }
    else {
        throw new AppError_1.AppError('Item does not exist', 400);
    }
}));
