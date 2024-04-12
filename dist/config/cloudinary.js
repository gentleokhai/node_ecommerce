"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = (file, folder) => {
    return new Promise((resolve) => {
        cloudinary_1.v2.uploader.upload(file, {
            folder: folder,
            resource_type: 'auto',
            use_filename: true,
        }, (error, result) => {
            if (error) {
                console.error('Error uploading file to Cloudinary:', error);
                return;
            }
            resolve({
                url: result === null || result === void 0 ? void 0 : result.url,
                id: result === null || result === void 0 ? void 0 : result.public_id,
            });
        });
    });
};
exports.upload = upload;
