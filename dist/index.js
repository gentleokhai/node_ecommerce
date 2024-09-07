"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const CustomerRoute_1 = require("./routes/CustomerRoute");
const transactionRoute_1 = require("./routes/transactionRoute");
require("./jobs/cron");
const validateCompany_1 = require("./middlewares/validateCompany");
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: '1.5mb' }));
exports.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
        console.log(req, 'here');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + path_1.default.extname(file.originalname));
    },
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname));
app.use('/auth', routes_1.AuthRoute);
app.use('/company', routes_1.CompanyRoute);
app.use(validateCompany_1.validateCompany);
app.use('/employee', routes_1.EmployeeRoute);
app.use('/item', routes_1.ItemRoute);
app.use('/customer', CustomerRoute_1.CustomerRoute);
app.use('/transactions', transactionRoute_1.TransactionRoute);
app.use(errorHandler_1.default);
mongoose_1.default
    .connect(config_1.MONGO_URI)
    .then(() => {
    console.log('DB connected');
})
    .catch((err) => console.log('error' + err));
app.listen(8000, () => {
    console.log('App is listening to the port 8000');
});
