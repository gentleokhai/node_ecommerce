"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const streamifier_1 = __importDefault(require("streamifier"));
const AppError_1 = require("../utility/AppError");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = (file, folder, res) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: 'auto',
            format: 'jpg',
            folder: folder,
        }, (error, result) => {
            if (error) {
                console.error('Error uploading file to Cloudinary:', error);
                throw new AppError_1.AppError('Error uploading image', 400);
            }
            resolve({
                url: result === null || result === void 0 ? void 0 : result.secure_url,
                id: result === null || result === void 0 ? void 0 : result.public_id,
            });
        });
        streamifier_1.default.createReadStream(file).pipe(uploadStream);
    });
};
exports.upload = upload;
