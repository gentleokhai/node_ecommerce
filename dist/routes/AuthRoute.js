"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validators_1 = require("../validators");
const router = express_1.default.Router();
exports.AuthRoute = router;
router.post('/signup', validators_1.signupValidator, auth_controller_1.signupController);
router.post('/login', validators_1.loginValidator, auth_controller_1.loginController);
router.post('/change-password', validators_1.changePasswordValidator, auth_controller_1.changePasswordController);
router.post('/forgot-password', auth_controller_1.forgotPasswordController);
