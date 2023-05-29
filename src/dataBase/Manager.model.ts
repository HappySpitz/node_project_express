import { model, Schema } from "mongoose";

const managerSchema = new Schema(
    {
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
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Manager = model("manager", managerSchema);
