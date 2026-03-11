"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.processOrder = exports.singleOrder = exports.makeNewOrder = exports.getAllOrders = void 0;
const error_1 = require("../middleware/error");
const utils_class_1 = __importDefault(require("../utils/utils-class"));
const order_1 = require("../models/order");
exports.getAllOrders = (0, error_1.TryCatch)(async (req, res) => {
    // Logic to create a new order
    res.status(201).json({
        success: true,
        message: "Order created successfully",
    });
});
exports.makeNewOrder = (0, error_1.TryCatch)(async (req, res, next) => {
    const { orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
    console.log("req.body===>", req.body);
    if (!orderItems || !subtotal || !tax || !discount || !total) {
        return next(new utils_class_1.default("Please add all fields", 400));
    }
    const order = await order_1.Order.create({
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    //await reduceStock(orderItems);
    return res.status(200).json({
        success: true,
        orders: [order], // Replace with actual orders data
    });
});
exports.singleOrder = (0, error_1.TryCatch)(async (req, res) => {
    const orderId = req.params.id;
    // Logic to get a single order by ID
    res.status(200).json({
        success: true,
        order: {}, // Replace with actual order data
    });
});
exports.processOrder = (0, error_1.TryCatch)(async (req, res) => {
    const orderId = req.params.id;
    // Logic to process the order
    res.status(200).json({
        success: true,
        message: "Order processed successfully",
    });
});
exports.cancelOrder = (0, error_1.TryCatch)(async (req, res) => {
    const orderId = req.params.id;
    // Logic to cancel the order
    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
    });
});
