"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_js_1 = __importDefault(require("./config/connectDB.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const product_js_1 = __importDefault(require("./routes/product.js"));
const order_js_1 = __importDefault(require("./routes/order.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: `${__dirname}/../.env` });
app.get("/server-health", (req, res) => {
  res.status(200).json({
    success: "ok",
    message: "Server is running",
  });
});
app.use((0, cookie_parser_1.default)());
const mongoConnectionUri = (0, connectDB_js_1.default)();
mongoose_1.default
  .connect(mongoConnectionUri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error in connecting database", error);
  });
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(
  (0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }),
);
app.use("/api/v1/users", user_js_1.default);
app.use("/api/v1/products", product_js_1.default);
app.use("/api/v1/orders", order_js_1.default);
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
