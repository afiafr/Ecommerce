"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.updateUser = exports.deleteUser = exports.singleUser = exports.getAllUsers = exports.logout = exports.login = exports.register = void 0;
const utils_class_1 = __importDefault(require("../utils/utils-class"));
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_1 = require("../middleware/error");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const saltRounds = 10; // Adjust this based on your security needs
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, saltRounds);
};
const register = async (req, res, next) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone) {
        return next(new utils_class_1.default("Please add all fileds", 400));
    }
    if (!password || password.length < 6) {
        return res
            .status(400)
            .json({ error: "Password must be 6 character log" });
    }
    const existingUser = await user_1.User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ error: "Email is taken" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new user_1.User({
        name,
        email,
        phone,
        password: hashedPassword,
    }).save();
    if (user) {
        (0, generateToken_1.default)(res, user._id);
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    }
    else {
        throw new Error("Failed to create user");
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400);
            throw new Error("Invalid email or password");
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isBanned) {
            return res
                .status(401)
                .json({ error: "User is banned. Please contact the admin." });
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Wrong password" });
        }
        // Send response with user details and token
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token: (0, generateToken_1.default)(res, user._id),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.login = login;
exports.logout = (0, express_async_handler_1.default)(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: "Logged out successfully" });
});
exports.getAllUsers = (0, error_1.TryCatch)(async (req, res) => {
    const search = req.query.search || "";
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
        $or: [
            { name: { $regex: searchRegExp } },
            { email: { $regex: searchRegExp } },
            { phone: { $regex: searchRegExp } },
        ],
    };
    const option = { password: 0 };
    const users = await user_1.User.find(filter, option)
        .limit(limit)
        .skip((page - 1) * 5);
    const count = await user_1.User.find(filter).countDocuments();
    if (!users) {
        return res
            .status(404)
            .json({ error: "No user found with the search term" });
    }
    return res.status(200).json({
        message: "success",
        users,
        pagination: {
            totalUser: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
    });
});
exports.singleUser = (0, error_1.TryCatch)(async (req, res, next) => {
    const id = req.params.id;
    const user = await user_1.User.findById(id);
    if (!user)
        return next(new utils_class_1.default("Invalid id", 400));
    return res.status(200).json({
        success: true,
        user,
    });
});
exports.deleteUser = (0, error_1.TryCatch)(async (req, res, next) => {
    const id = req.params.id;
    const user = await user_1.User.findById(id);
    if (!user)
        return next(new utils_class_1.default("Invalid id", 400));
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User deleted successfull",
    });
});
exports.updateUser = (0, error_1.TryCatch)(async (req, res) => {
    const userId = req.params.id;
    const { isBanned, role } = req.body;
    try {
        const user = await user_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (isBanned != undefined) {
            user.isBanned = isBanned;
        }
        if (role) {
            user.role = role;
        }
        await user_1.User.findOneAndUpdate({ _id: userId }, user);
        const updatedUser = await user_1.User.findById(userId);
        if (!updatedUser) {
            return res
                .status(500)
                .json({ error: "Failed to fetch updated user data" });
        }
        res.json({ user: updatedUser });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
    if (!("user" in req)) {
        res.status(404);
        next({ error: "User not found" });
    }
    else {
        const user = req.user;
        res.json(user);
    }
});
