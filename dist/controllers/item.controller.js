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
exports.restockItemsController = exports.getPOSItemsController = exports.archiveItemController = exports.deleteItemController = exports.updateItemStockController = exports.updateItemPriceController = exports.updateItemController = exports.getItemByIdController = exports.getItemsController = exports.createItemController = void 0;
const cloudinary_1 = require("../config/cloudinary");
const filters_1 = require("../dto/item/filters");
const items_model_1 = require("../models/items.model");
const item_service_1 = require("../services/item.service");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const exchangeRate_service_1 = require("../services/exchangeRate.service");
const helpers_1 = require("../utility/helpers");
exports.createItemController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, category, unit, sku, weight, description, costPrice, sellingPrice, wholesalePrice, quantityInPack, stock, lowStock, } = req.body;
    const company = req.company;
    const existingItem = yield items_model_1.Item.findOne({
        name: name,
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    if (existingItem !== null)
        throw new AppError_1.AppError('An item already exists with this name', 400);
    const buffer = Buffer.from(image !== null && image !== void 0 ? image : '', 'base64');
    const uploader = (path) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_1.upload)(path, 'Zulu', res); });
    const cloudImage = yield uploader(buffer);
    const convertedCostPrice = yield (0, exchangeRate_service_1.convertToUSD)(costPrice, company === null || company === void 0 ? void 0 : company.buyingCurrency);
    const convertedSellingPrice = yield (0, exchangeRate_service_1.convertToUSD)(sellingPrice, company === null || company === void 0 ? void 0 : company.buyingCurrency);
    const convertedWholesalePrice = yield (0, exchangeRate_service_1.convertToUSD)(wholesalePrice, company === null || company === void 0 ? void 0 : company.buyingCurrency);
    const createItemService = yield (0, item_service_1.createItem)({
        image: cloudImage.url,
        name,
        category,
        unit,
        sku,
        weight,
        description,
        costPrice: convertedCostPrice,
        sellingPrice: convertedSellingPrice,
        wholesalePrice: wholesalePrice ? convertedWholesalePrice : null,
        quantityInPack,
        stock,
        lowStock,
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    res.status(201).json(createItemService);
}));
exports.getItemsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, sortOptions } = (0, filters_1.getItemsFilter)(req);
    const company = req.company;
    const viewingCurrency = (company === null || company === void 0 ? void 0 : company.viewingCurrency) || 'USD';
    const page = parseInt(req.query.page, 10) || 1;
    const pagePerLimit = parseInt(req.query.pagePerLimit, 10) || 10;
    const startIndex = (page - 1) * pagePerLimit;
    const endIndex = page * pagePerLimit;
    query.company = company === null || company === void 0 ? void 0 : company._id;
    const items = yield items_model_1.Item.find(query).sort(sortOptions).populate('category');
    const paginatedItems = items.slice(startIndex, endIndex);
    const convertedItems = yield Promise.all(paginatedItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        item.costPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.costPrice, viewingCurrency));
        item.sellingPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.sellingPrice, viewingCurrency));
        item.wholesalePrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.wholesalePrice, viewingCurrency));
        item.currency = viewingCurrency;
        return item;
    })));
    const totalPages = Math.ceil(items.length / pagePerLimit);
    const totalItems = items.length - 1;
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    const currentPage = page;
    res.status(200).json({
        items: convertedItems,
        totalPages,
        pagePerLimit,
        totalItems,
        nextPage,
        previousPage,
        currentPage,
    });
}));
exports.getItemByIdController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const company = req.company;
    const viewingCurrency = (company === null || company === void 0 ? void 0 : company.viewingCurrency) || 'USD';
    const item = yield items_model_1.Item.findOne({
        _id: id,
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    const convertedItem = Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item.toObject()), { costPrice: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item === null || item === void 0 ? void 0 : item.costPrice, viewingCurrency)), sellingPrice: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item === null || item === void 0 ? void 0 : item.sellingPrice, viewingCurrency)), wholesalePrice: (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item === null || item === void 0 ? void 0 : item.wholesalePrice, viewingCurrency)), currency: viewingCurrency });
    res.status(200).json(convertedItem);
}));
exports.updateItemController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, category, unit, sku, weight, description } = req.body;
    const id = req.params.id;
    const existingItem = yield items_model_1.Item.findById(id);
    if (existingItem !== null) {
        if (typeof image === 'string' &&
            image.startsWith('https://res.cloudinary.com')) {
            existingItem.image = image;
        }
        else {
            const buffer = Buffer.from(image !== null && image !== void 0 ? image : '', 'base64');
            const uploader = (path) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_1.upload)(path, 'Zulu', res); });
            const cloudImage = yield uploader(buffer);
            existingItem.image = cloudImage.url;
        }
        name && (existingItem.name = name);
        category && (existingItem.category = category);
        unit && (existingItem.unit = unit);
        sku && (existingItem.sku = sku);
        weight && (existingItem.weight = weight);
        description && (existingItem.description = description);
        yield existingItem.save();
        return res.json(existingItem);
    }
    else {
        throw new AppError_1.AppError('Item does not exist', 400);
    }
}));
exports.updateItemPriceController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { costPrice, sellingPrice } = req.body;
    const id = req.params.id;
    const existingItem = yield items_model_1.Item.findById(id);
    const convertedCostPrice = yield (0, exchangeRate_service_1.convertNGNToUSD)(costPrice);
    const convertedSellingPrice = yield (0, exchangeRate_service_1.convertNGNToUSD)(sellingPrice);
    if (existingItem !== null) {
        existingItem.costPrice = convertedCostPrice;
        existingItem.sellingPrice = convertedSellingPrice;
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
exports.deleteItemController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield items_model_1.Item.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new AppError_1.AppError('Item does not exist', 400);
    }
    return res.json({ message: 'Item deleted successfully' });
}));
exports.archiveItemController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const existingItem = yield items_model_1.Item.findById(id);
    if (existingItem !== null) {
        existingItem.archived = !existingItem.archived;
        yield existingItem.save();
        return res.json(existingItem);
    }
    else {
        throw new AppError_1.AppError('Item does not exist', 400);
    }
}));
exports.getPOSItemsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { query, sortOptions } = (0, filters_1.getItemsFilter)(req);
    const company = req.company;
    const viewingCurrency = (_a = company === null || company === void 0 ? void 0 : company.viewingCurrency) !== null && _a !== void 0 ? _a : '';
    const items = yield items_model_1.Item.find(Object.assign(Object.assign({}, query), { archived: false, company: company === null || company === void 0 ? void 0 : company._id }))
        .sort(sortOptions)
        .populate('category');
    const convertedItems = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        item.costPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.costPrice, viewingCurrency));
        item.sellingPrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.sellingPrice, viewingCurrency));
        item.wholesalePrice = (0, helpers_1.roundUp)(yield (0, exchangeRate_service_1.convertToCurrency)(item.wholesalePrice, viewingCurrency));
        item.currency = viewingCurrency;
        return item;
    })));
    res.status(200).json(convertedItems);
}));
exports.restockItemsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    for (const transactionItem of items) {
        const item = yield items_model_1.Item.findById(transactionItem.item);
        if (item) {
            item.stock += Number(transactionItem.numberOfItems);
            if (item.stock < 0) {
                throw new AppError_1.AppError(`Insufficient stock for item: ${item.name}`, 400);
            }
            yield item.save();
            res.status(201).json({ message: 'Stock updated' });
        }
        else {
            throw new AppError_1.AppError(`Item with ID ${transactionItem.item} not found`, 400);
        }
    }
}));
