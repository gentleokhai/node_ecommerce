"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoute = void 0;
const express_1 = __importDefault(require("express"));
const employee_controller_1 = require("../controllers/employee.controller");
const middlewares_1 = require("../middlewares");
const employee_validator_1 = require("../validators/employee.validator");
const router = express_1.default.Router();
exports.EmployeeRoute = router;
router.use(middlewares_1.Authenticate);
router.get('', employee_controller_1.getEmployeesController);
router.get('/:id', employee_controller_1.getEmployeeByIdController);
router.post('', employee_validator_1.createEmployeeValidator, employee_controller_1.createEmployeeController);
router.patch('/:id', employee_validator_1.updateEmployeeValidator, employee_controller_1.updateEmployeeController);
router.patch('/access/:id', employee_validator_1.updateEmployeeAccessValidator, employee_controller_1.updateEmployeeAccessController);
router.patch('/status/:id', employee_validator_1.updateEmployeeStatusValidator, employee_controller_1.updateEmployeeStatusController);
