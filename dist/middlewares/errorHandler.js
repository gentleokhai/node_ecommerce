"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../utility/AppError");
const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error instanceof AppError_1.AppError) {
        const appError = error;
        return res.status(appError.statusCode).json({
            message: appError.message,
        });
    }
    return res.status(500).send('Something went wrong');
};
exports.default = errorHandler;
