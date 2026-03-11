"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../controllers/order");
const router = express_1.default.Router();
router.post("/new", order_1.makeNewOrder);
//router.get("/all", requireSignin, getAllOrders);
//router.get("/:id", requireSignIn, singleOrder);
//router.get("/:id", processOrder)
//router.get("/:id", cancelOrder)
exports.default = router;
