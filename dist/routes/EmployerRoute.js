"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerRoute = void 0;
const express_1 = __importDefault(require("express"));
const employer_controller_1 = require("../controllers/employer.controller");
const middlewares_1 = require("../middlewares");
const employer_validator_1 = require("../validators/employer.validator");
const router = express_1.default.Router();
exports.EmployerRoute = router;
router.use(middlewares_1.Authenticate);
router.patch('', employer_validator_1.createOrUpdateEmployerValidator, employer_controller_1.updateEmployerController);
router.get('', employer_controller_1.getEmployerController);
