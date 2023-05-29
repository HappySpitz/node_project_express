import {NextFunction, Request, Response} from "express";
import {Manager, Seller} from "../dataBase";
import {ApiError} from "../errors";
import {IUser} from "../types";

class UserMiddleware {
    public async getByIdOrThrow(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {userId} = req.params;

            const seller = await Seller.findById(userId);
            const manager = await Manager.findById(userId);

            if (!seller && !manager) {
                throw new ApiError("User not found!", 422);
            }

            if (seller) {
                res.locals.seller = seller;
            } else {
                res.locals.manager = manager;
            }

            next()
        } catch (e) {
            next(e)
        }
    }

    public getDynamicallyAndThrow(fieldName: string, from: "body" |"query" | "params" = "body", dbField: keyof IUser = "email") {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const fieldValue = req[from][fieldName];

                let user;
                if (dbField in Seller.schema.paths || dbField in Manager.schema.paths) {
                    user = await Seller.findOne({ [dbField]: fieldValue }) || await Manager.findOne({ [dbField]: fieldValue });
                }

                if (user) {
                    throw new ApiError(`User with ${fieldName} ${fieldValue} already exists`, 409);
                }

                next()
            } catch (e) {
                next(e)
            }
        }
    }

    public getDynamicallyOrThrow(fieldName: string, from: "body" |"query" | "params" = "body", dbField: keyof IUser = "email") {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const fieldValue = req[from][fieldName];

                const user = await Seller.findOne({ [dbField]: fieldValue }) || await Manager.findOne({ [dbField]: fieldValue });

                if (!user) {
                    throw new ApiError(`User not found`, 422);
                }

                res.locals.user = user;

                next()
            } catch (e) {
                next(e)
            }
        }
    }
}

export const userMiddleware = new UserMiddleware();