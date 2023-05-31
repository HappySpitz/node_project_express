import { model, Schema, Types } from "mongoose";

import {
  EBrands,
  ECurrency,
  EModels,
  ERegions,
  EStatus,
  ETypesCar,
} from "../enums";
import { Seller } from "./Seller.model";

const carSchema = new Schema(
  {
    type: {
      type: String,
      enum: ETypesCar,
      required: true,
    },
    brand: {
      type: String,
      enum: EBrands,
      required: true,
    },
    model: {
      type: String,
      enum: EModels,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ECurrency,
      required: true,
    },
    region: {
      type: String,
      enum: ERegions,
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
      type: Types.ObjectId,
      required: true,
      ref: Seller,
    },
    isActive: {
      type: String,
      enum: EStatus,
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Car = model("car", carSchema);
