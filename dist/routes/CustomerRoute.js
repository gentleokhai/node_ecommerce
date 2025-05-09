"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("../controllers/customer.controller");
const group_controller_1 = require("../controllers/group.controller");
const general_1 = require("../dto/general");
const middlewares_1 = require("../middlewares");
const checkRole_1 = require("../middlewares/checkRole");
const validateCompany_1 = require("../middlewares/validateCompany");
const customer_validator_1 = require("../validators/customer.validator");
const group_validator_1 = require("../validators/group.validator");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.use(middlewares_1.Authenticate);
router.use(validateCompany_1.validateCompany);
router.use((0, checkRole_1.checkRole)([general_1.AccessType.EXECUTIVE, general_1.AccessType.MANAGER, general_1.AccessType.CASHIER]));
router.post('', customer_validator_1.createCustomerValidator, customer_controller_1.createCustomerController);
router.get('', customer_controller_1.getCustomersController);
router.post('/group', group_validator_1.createGroupValidator, group_controller_1.createGroupController);
router.get('/group', group_controller_1.getGroupController);
router.get('/:id', customer_controller_1.getCustomerByIdController);
router.patch('/:id', customer_validator_1.updateCustomerValidator, customer_controller_1.updateCustomerController);
router.delete('/:id', customer_controller_1.deleteCustomerController);
router.post('/notes/:id', customer_controller_1.createNotesController);
router.patch('/notes/:id', customer_controller_1.updateNotesController);
router.delete('/notes/:id', customer_controller_1.deleteNotesController);
