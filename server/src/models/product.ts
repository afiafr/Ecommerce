import mongoose from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  group: string;
  msrp: number;
  price: number;
  status: "Available" | "Unavailable";
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    group: {
      type: String,
      required: [true, "Group is required"],
    },
    msrp: {
      type: Number,
      required: [true, "MSRP is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>("Product", schema);
