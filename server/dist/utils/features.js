"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceStock = void 0;
const product_js_1 = require("../models/product.js");
const reduceStock = async (orderItems) => {
    for (const item of orderItems) {
        const product = await product_js_1.Product.findById(item.productId);
        if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
        }
        product.stock -= item.quantity;
        await product.save();
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
        });
    }
};
exports.reduceStock = reduceStock;
