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
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err);
//   res.status(500).send('Something went wrong!');
// });
app.use('/auth', routes_1.AuthRoute);
app.use('/employer', routes_1.EmployerRoute);
app.use('/employee', routes_1.EmployeeRoute);
app.use('/company', routes_1.CompanyRoute);
app.use('/item', routes_1.ItemRoute);
mongoose_1.default
    .connect(config_1.MONGO_URI)
    .then(() => {
    console.log('DB connected');
})
    .catch((err) => console.log('error' + err));
app.listen(8000, () => {
    console.log('App is listening to the port 8000');
});
