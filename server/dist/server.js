"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_js_1 = __importDefault(require("./config/connectDB.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: `${__dirname}/../.env` });
app.get("/server-health", (req, res) => {
    res.status(200).json({
        success: "ok",
        message: "Server is running"
    });
});
const mongoConnectionUri = (0, connectDB_js_1.default)();
mongoose_1.default.connect(mongoConnectionUri)
    .then(() => {
    console.log("Connected to database");
}).catch((error) => {
    console.error("Error in connecting database");
});
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use("/api/v1/users", userRoutes_js_1.default);
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
