"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../enums");
const Seller_model_1 = require("./Seller.model");
const carSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: enums_1.ETypesCar,
        required: true,
    },
    brand: {
        type: String,
        enum: enums_1.EBrands,
        required: true,
    },
    model: {
        type: String,
        enum: enums_1.EModels,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        enum: enums_1.ECurrency,
        required: true
    },
    region: {
        type: String,
        enum: enums_1.ERegions,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    photo: {
        type: [String],
        required: false,
    },
    seller: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: Seller_model_1.Seller,
    },
    isActive: {
        type: String,
        enum: enums_1.EStatus,
        default: "inactive",
    },
    views: {
        type: Number,
        default: 0,
    },
    viewsByPeriod: {
        type: Number,
        default: 0,
    },
    averagePrice: {
        type: Number,
        default: 0,
    },
    averagePriceInUkraine: {
        type: Number,
        default: 0,
    },
    convertedPriceUAH: {
        type: Number,
    },
    convertedPriceUSD: {
        type: Number,
    },
    convertedPriceEUR: {
        type: Number,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Car = (0, mongoose_1.model)("car", carSchema);
