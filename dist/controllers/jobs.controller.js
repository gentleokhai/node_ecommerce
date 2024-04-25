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
exports.getJobsController = exports.createJobController = void 0;
const jobs_model_1 = require("../models/jobs.model");
const tryCatch_1 = require("../utility/tryCatch");
const AppError_1 = require("../utility/AppError");
exports.createJobController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const existingJob = yield jobs_model_1.Jobs.findOne({ name: name });
    if (existingJob !== null)
        throw new AppError_1.AppError('A job already exists with this title', 400);
    const createJobService = yield jobs_model_1.Jobs.create({ name: name });
    res.status(201).json(createJobService);
}));
exports.getJobsController = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield jobs_model_1.Jobs.find();
    res.status(200).json(jobs);
}));
