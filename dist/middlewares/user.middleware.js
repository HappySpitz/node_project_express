"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const dataBase_1 = require("../dataBase");
const errors_1 = require("../errors");
class UserMiddleware {
    async getByIdOrThrow(req, res, next) {
        try {
            const { userId } = req.params;
            const seller = await dataBase_1.Seller.findById(userId);
            const manager = await dataBase_1.Manager.findById(userId);
            if (!seller && !manager) {
                throw new errors_1.ApiError("User not found!", 422);
            }
            if (seller) {
                res.locals.seller = seller;
            }
            else {
                res.locals.manager = manager;
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
    getDynamicallyAndThrow(fieldName, from = "body", dbField = "email") {
        return async (req, res, next) => {
            try {
                const fieldValue = req[from][fieldName];
                let user;
                if (dbField in dataBase_1.Seller.schema.paths || dbField in dataBase_1.Manager.schema.paths) {
                    user = await dataBase_1.Seller.findOne({ [dbField]: fieldValue }) || await dataBase_1.Manager.findOne({ [dbField]: fieldValue });
                }
                if (user) {
                    throw new errors_1.ApiError(`User with ${fieldName} ${fieldValue} already exists`, 409);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    getDynamicallyOrThrow(fieldName, from = "body", dbField = "email") {
        return async (req, res, next) => {
            try {
                const fieldValue = req[from][fieldName];
                const user = await dataBase_1.Seller.findOne({ [dbField]: fieldValue }) || await dataBase_1.Manager.findOne({ [dbField]: fieldValue });
                if (!user) {
                    throw new errors_1.ApiError(`User not found`, 422);
                }
                res.locals.user = user;
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.userMiddleware = new UserMiddleware();
