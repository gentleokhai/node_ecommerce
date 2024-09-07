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
exports.Customer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const general_1 = require("../dto/general");
const CustomerSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, index: true },
    phoneNumber: { type: String },
    firstName: { type: String, index: true },
    lastName: { type: String, index: true },
    gender: { type: String, enum: Object.values(general_1.Gender), index: true },
    group: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'group' },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'employee' },
    notes: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'notes' },
    firstVisited: { type: Date, default: Date.now },
    lastVisited: { type: Date, default: Date.now },
    totalSpend: { type: Number },
    company: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'company' },
}, {
    toJSON: {
        transform(_, ret) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret.__v;
            delete ret._id;
            delete ret.updatedAt;
        },
    },
    toObject: {
        transform(_, ret) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret.__v;
            delete ret._id;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
const Customer = mongoose_1.default.model('customer', CustomerSchema);
exports.Customer = Customer;
