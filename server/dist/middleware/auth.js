"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.requireSignIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_class_1 = __importDefault(require("../utils/utils-class"));
const user_1 = require("../models/user");
const requireSignIn = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await user_1.User.findById(decoded.userId).select("-password"); //logged in user
        next();
    }
    catch (err) {
        res.status(401);
        return next(new utils_class_1.default("Authentication failed", 401));
    }
};
exports.requireSignIn = requireSignIn;
const isAdmin = async (req, res, next) => {
    try {
        const user = await user_1.User.findById(req.user?._id);
        if (!user) {
            return next(new utils_class_1.default("User not found", 404));
        }
        if (user.role !== "admin") {
            return next(new utils_class_1.default("Authentication failed, Need admin access", 401));
        }
        next();
    }
    catch (err) {
        return next(new utils_class_1.default("Something went wrong", 500));
    }
};
exports.isAdmin = isAdmin;
