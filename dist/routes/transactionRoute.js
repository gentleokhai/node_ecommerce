"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoute = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.TransactionRoute = router;
router.use(middlewares_1.Authenticate);
router.post('', transaction_controller_1.createTransactionController);
router.get('', transaction_controller_1.getTransactionsController);
router.get('/:id', transaction_controller_1.getTransactionsByIdController);
router.get('/customer/:id', transaction_controller_1.getTransactionsByCustomerController);
