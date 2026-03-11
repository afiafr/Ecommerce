"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${(0, uuid_1.v4)()}`;
        const extension = file.originalname.split(".").pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    }
});
const maxFileSize = 5 * 1024 * 1024; // 5MB
const limits = {
    fileSize: maxFileSize
};
const upload = (0, multer_1.default)({ storage, limits });
exports.default = upload;
