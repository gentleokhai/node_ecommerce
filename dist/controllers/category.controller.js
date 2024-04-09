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
const createCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const existingJob = yield category_model_1.Category.findOne({ name: name });
    if (existingJob !== null)
        return res.json({ message: 'A job already exists with this title' });
    const createCategoryService = yield category_model_1.Category.create({ name: name });
    res.status(201).json(createCategoryService);
});
exports.createCategoryController = createCategoryController;
const getCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.find();
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});
exports.getCategoryController = getCategoryController;
