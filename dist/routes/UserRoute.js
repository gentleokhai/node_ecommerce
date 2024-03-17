"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const middlewares_1 = require("../middlewares");
const user_validator_1 = require("../validators/user.validator");
const router = express_1.default.Router();
exports.UserRoute = router;
router.use(middlewares_1.Authenticate);
// router.post('', CreateUser);
router.patch('', user_validator_1.createOrUpdateUserValidator, user_controller_1.updateUserController);
