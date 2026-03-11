import { TryCatch } from "../middleware/error";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utils-class";
import { Order } from "../models/order";

export const getAllOrders = TryCatch(async (req: Request, res: Response) => {
    // Logic to create a new order
    res.status(201).json({
        success: true,
        message: "Order created successfully",
    });
});

export const makeNewOrder = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;

    if (!orderItems || !subtotal || !tax || !discount || !total) {
        return next(new ErrorHandler("Please add all fields", 400));
    }

    const order = await Order.create({
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    })

    //await reduceStock(orderItems);

    return res.status(200).json({
        success: true,
        orders: [order], // Replace with actual orders data
    });
});

export const singleOrder = TryCatch(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    // Logic to get a single order by ID
    res.status(200).json({
        success: true,
        order: {}, // Replace with actual order data
    });
});

export const processOrder = TryCatch(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    // Logic to process the order
    res.status(200).json({
        success: true,
        message: "Order processed successfully",
    });
});

export const cancelOrder = TryCatch(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    // Logic to cancel the order
    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
    });
});