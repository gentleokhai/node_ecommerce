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
exports.ExchangeRates = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ExchangeRatesSchema = new mongoose_1.Schema({
    currencyCode: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    lastUpdated: { type: Date, required: true },
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id.toString();
            delete ret.__v;
            delete ret._id;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
const ExchangeRates = mongoose_1.default.model('exchangeRates', ExchangeRatesSchema);
exports.ExchangeRates = ExchangeRates;
