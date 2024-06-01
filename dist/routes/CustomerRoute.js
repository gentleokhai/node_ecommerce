"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("../controllers/customer.controller");
const general_1 = require("../dto/general");
const middlewares_1 = require("../middlewares");
const checkRole_1 = require("../middlewares/checkRole");
const customer_validator_1 = require("../validators/customer.validator");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.use(middlewares_1.Authenticate);
router.use((0, checkRole_1.checkRole)([general_1.AccessType.EXECUTIVE, general_1.AccessType.MANAGER, general_1.AccessType.CASHIER]));
router.post('', customer_validator_1.createCustomerValidator, customer_controller_1.createCustomerController);
router.get('', customer_controller_1.getCustomersController);
