import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        user: {
            type: String,
            ref: "User",
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        shippingCharges: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing",
        },

        orderItems: [
            {
                name: String,
                price: Number,
                quantity: Number,
                productId: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", schema);
