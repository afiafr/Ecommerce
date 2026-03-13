"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema(
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
exports.Product = mongoose_1.default.model("Product", schema);
