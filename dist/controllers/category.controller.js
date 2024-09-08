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
exports.getCategoryController = exports.createCategoryController = void 0;
const category_model_1 = require("../models/category.model");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
exports.createCategoryController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const company = req.company;
    const existingCategory = yield category_model_1.Category.findOne({
        name,
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    if (existingCategory) {
        throw new AppError_1.AppError('A category already exists with this name', 400);
    }
    const createCategoryService = yield category_model_1.Category.create({
        name,
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    res.status(201).json(createCategoryService);
}));
exports.getCategoryController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = req.company;
    const category = yield category_model_1.Category.find({
        company: company === null || company === void 0 ? void 0 : company._id,
    });
    res.status(200).json(category);
}));
