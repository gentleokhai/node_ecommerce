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
exports.createCompanyValidator = void 0;
const class_validator_1 = require("class-validator");
const company_1 = require("../dto/company");
const createCompanyValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'Missing request body!' });
        }
        const data = new company_1.CreateCompanyValidationSchema(req.body.businessName, req.body.businessType, req.body.industry, req.body.companySize, req.body.addressNumber, req.body.buyingCurrency, req.body.sellingCurrency, req.body.street, req.body.city, req.body.state, req.body.zipCode);
        yield (0, class_validator_1.validateOrReject)(data);
        next();
    }
    catch (e) {
        console.log(e);
        const errors = e.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints)[0],
        }));
        res.status(400).send(errors);
    }
});
exports.createCompanyValidator = createCompanyValidator;
