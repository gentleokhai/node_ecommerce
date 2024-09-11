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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePriceForViewingCurrency = exports.convertNGNToUSD = exports.convertToUSD = exports.convertToCurrency = exports.fetchAndStoreExchangeRates = void 0;
const axios_1 = __importDefault(require("axios"));
const exchangeRates_model_1 = require("../models/exchangeRates.model");
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = require("../utility/AppError");
const models_1 = require("../models");
const API_URL = process.env.EXCHANGE_RATES_URL;
const API_KEY = process.env.EXCHANGE_RATES_KEY;
dotenv_1.default.config();
const fetchAndStoreExchangeRates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(API_URL, {
            params: {
                base_currency: 'USD',
            },
            headers: {
                apikey: API_KEY,
            },
        });
        if (response.status === 200) {
            const exchangeData = response.data.data;
            const lastUpdated = new Date(response.data.meta.last_updated_at);
            for (const currencyCode in exchangeData) {
                const { code, value } = exchangeData[currencyCode];
                yield exchangeRates_model_1.ExchangeRates.findOneAndUpdate({ currencyCode: code }, { value, lastUpdated }, { upsert: true, new: true });
            }
        }
        else {
            console.error('Failed to fetch exchange rates');
        }
    }
    catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
});
exports.fetchAndStoreExchangeRates = fetchAndStoreExchangeRates;
function getExchangeRate(currencyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const rate = yield exchangeRates_model_1.ExchangeRates.findOne({ currencyCode });
        if (!rate) {
            throw new AppError_1.AppError(`Exchange rate for ${currencyCode} not found`, 400);
        }
        return rate.value;
    });
}
function convertToCurrency(amount, currencyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchangeRate = yield getExchangeRate(currencyCode);
        return amount * exchangeRate;
    });
}
exports.convertToCurrency = convertToCurrency;
function convertToUSD(amount, currencyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchangeRate = yield getExchangeRate(currencyCode);
        return amount / exchangeRate;
    });
}
exports.convertToUSD = convertToUSD;
function convertNGNToUSD(amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchangeRate = yield getExchangeRate('NGN');
        return amount / exchangeRate;
    });
}
exports.convertNGNToUSD = convertNGNToUSD;
function calculatePriceForViewingCurrency(companyId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const company = yield models_1.Company.findById(companyId);
        if (!company) {
            throw new Error('Company not found');
        }
        const exchangeRate = yield getExchangeRate(company.viewingCurrency || 'USD');
        return amount * exchangeRate;
    });
}
exports.calculatePriceForViewingCurrency = calculatePriceForViewingCurrency;
