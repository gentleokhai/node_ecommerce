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
exports.Company = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CompanySchema = new mongoose_1.Schema({
    businessType: { type: String },
    businessName: { type: String },
    industry: { type: String },
    gender: { type: String },
    companySize: { type: String },
    addressNumber: { type: String },
    sellingCurrency: { type: String },
    buyingCurrency: { type: String },
    viewingCurrency: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    branch: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'branch' }],
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' }],
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id.toString();
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret._id;
            delete ret.createdAt, delete ret.updatedAt;
        },
    },
    toObject: {
        transform(_, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    },
    timestamps: true,
});
CompanySchema.pre('save', function (next) {
    if (!this.viewingCurrency && this.sellingCurrency) {
        this.viewingCurrency = this.sellingCurrency;
    }
    next();
});
const Company = mongoose_1.default.model('company', CompanySchema);
exports.Company = Company;
