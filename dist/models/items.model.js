"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ItemSchema = new mongoose_1.Schema({
    image: { type: String, default: null },
    name: { type: String },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'category',
    },
    unit: { type: String },
    sku: { type: String },
    weight: { type: String },
    description: { type: String },
    costPrice: { type: Number },
    sellingPrice: { type: Number },
    currency: { type: String },
    wholesalePrice: { type: Number, default: null },
    quantityInPack: { type: Number, default: null },
    stock: { type: Number, default: null },
    lowStock: { type: Number, default: null },
    archived: { type: Boolean, default: false },
}, {
    toJSON: {
        transform(_, ret) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret._id;
            delete ret.createdAt, delete ret.updatedAt;
        },
    },
    timestamps: true,
});
const Item = mongoose_1.default.model('item', ItemSchema);
exports.Item = Item;
