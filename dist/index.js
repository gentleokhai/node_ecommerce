"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/auth', routes_1.AuthRoute);
app.use('/employer', routes_1.EmployerRoute);
app.use('/employee', routes_1.EmployeeRoute);
app.use('/company', routes_1.CompanyRoute);
mongoose_1.default
    .connect(config_1.MONGO_URI)
    .then(() => {
    console.log('DB connected');
})
    .catch((err) => console.log('error' + err));
app.listen(8000, () => {
    console.log('App is listening to the port 8000');
});
