"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seller = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../enums");
const sellerSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        required: [true, "Telephone number is required"],
    },
    type: {
        type: String,
        enum: enums_1.ETypesSeller,
        default: enums_1.ETypesSeller.basic
    },
    avatar: {
        type: String,
        required: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Seller = (0, mongoose_1.model)("seller", sellerSchema);
