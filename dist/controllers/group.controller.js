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
exports.getGroupController = exports.createGroupController = void 0;
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
const group_model_1 = require("../models/group.model");
exports.createGroupController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const existingGroup = yield group_model_1.Group.findOne({ name: name });
    if (existingGroup !== null)
        throw new AppError_1.AppError('A group already exists with this title', 400);
    const createGroupService = yield group_model_1.Group.create({ name: name });
    res.status(201).json(createGroupService);
}));
exports.getGroupController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield group_model_1.Group.find();
    res.status(200).json(groups);
}));
