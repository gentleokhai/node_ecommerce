"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRoute = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const item_controller_1 = require("../controllers/item.controller");
const middlewares_1 = require("../middlewares");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.ItemRoute = router;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.resolve(__dirname, '../../src/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.use(middlewares_1.Authenticate);
router.post('', upload.single('image'), item_controller_1.createItemController);
router.get('', item_controller_1.getItemsController);
router.get('/:id', item_controller_1.getItemByIdController);
router.patch('/:id/price', item_controller_1.updateItemPriceController);
router.patch('/:id/stock', item_controller_1.updateItemStockController);
