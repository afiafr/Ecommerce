import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoUri from "./config/connectDB.js";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config({ path: `${__dirname}/../.env` });

app.get("/server-health", (req: Request, res: Response) => {
  res.status(200).json({
    success: "ok",
    message: "Server is running",
  });
});

app.use(cookieParser());
const mongoConnectionUri = mongoUri();
mongoose
  .connect(mongoConnectionUri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error in connecting database", error);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
