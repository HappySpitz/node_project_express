import { model, Schema } from "mongoose";

import { ETypesSeller } from "../enums";

const sellerSchema = new Schema(
  {
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
      enum: ETypesSeller,
      default: ETypesSeller.basic,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Seller = model("seller", sellerSchema);
