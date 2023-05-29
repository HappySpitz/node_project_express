"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const mongoose_1 = require("mongoose");
const managerSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Manager = (0, mongoose_1.model)("manager", managerSchema);
