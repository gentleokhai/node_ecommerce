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
const createItemController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, category, unit, sku, weight, description, currency, costPrice, sellingPrice, wholesalePrice, quantityInPack, stock, lowStock, } = req.body;
    const existingItem = yield items_model_1.Item.findOne({ name: name });
    if (existingItem !== null)
        return res.json({ message: 'An item already exists with this name' });
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
});
exports.createItemController = createItemController;
const getItemsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, sortOptions } = (0, filters_1.getItemsFilter)(req);
    try {
        const items = yield items_model_1.Item.find(query).sort(sortOptions).populate('category');
        res.status(200).json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});
exports.getItemsController = getItemsController;
const getItemByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const item = yield items_model_1.Item.findById(id);
        res.status(200).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});
exports.getItemByIdController = getItemByIdController;
const updateItemPriceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { costPrice, sellingPrice } = req.body;
    const id = req.params.id;
    try {
        const existingItem = yield items_model_1.Item.findById(id);
        if (existingItem !== null) {
            existingItem.costPrice = costPrice;
            existingItem.sellingPrice = sellingPrice;
            yield existingItem.save();
            return res.json(existingItem);
        }
        else {
            return res.status(400).json({ message: 'Item does not exist' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateItemPriceController = updateItemPriceController;
const updateItemStockController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stock, lowStock } = req.body;
    const id = req.params.id;
    try {
        const existingItem = yield items_model_1.Item.findById(id);
        if (existingItem !== null) {
            existingItem.stock = stock;
            existingItem.lowStock = lowStock;
            yield existingItem.save();
            return res.json(existingItem);
        }
        else {
            return res.status(400).json({ message: 'Item does not exist' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateItemStockController = updateItemStockController;
