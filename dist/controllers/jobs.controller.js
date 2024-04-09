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
const createJobController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const existingJob = yield jobs_model_1.Jobs.findOne({ name: name });
    if (existingJob !== null)
        return res.json({ message: 'A job already exists with this title' });
    const createJobService = yield jobs_model_1.Jobs.create({ name: name });
    res.status(201).json(createJobService);
});
exports.createJobController = createJobController;
const getJobsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield jobs_model_1.Jobs.find();
        res.status(200).json(jobs);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});
exports.getJobsController = getJobsController;
