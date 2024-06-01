"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoute = void 0;
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const general_1 = require("../dto/general");
const middlewares_1 = require("../middlewares");
const checkRole_1 = require("../middlewares/checkRole");
const company_validator_1 = require("../validators/company.validator");
const router = express_1.default.Router();
exports.CompanyRoute = router;
router.use(middlewares_1.Authenticate);
router.use((0, checkRole_1.checkRole)([general_1.AccessType.EXECUTIVE, general_1.AccessType.MANAGER]));
router.post('', company_validator_1.createCompanyValidator, company_controller_1.createCompanyController);
