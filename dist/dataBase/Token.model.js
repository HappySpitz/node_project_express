"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const Seller_model_1 = require("./Seller.model");
const tokenSchema = new mongoose_1.Schema({
    _user_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: Seller_model_1.Seller
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
}, {
    versionKey: false,
    timestamps: true
});
exports.Token = (0, mongoose_1.model)("token", tokenSchema);
