"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../errors");
const services_1 = require("../services");
const dataBase_1 = require("../dataBase");
const enums_1 = require("../enums");
class AuthMiddleware {
    async checkedAccessToken(req, res, next) {
        try {
            const accessToken = req.get("Authorization");
            if (!accessToken) {
                throw new errors_1.ApiError("No token!", 401);
            }
            const jwtPayload = services_1.tokenService.checkToken(accessToken);
            let user;
            if (jwtPayload && jwtPayload._id) {
                user = await dataBase_1.Seller.findOne({ _id: jwtPayload._id });
                if (user.type === enums_1.ETypesSeller.forbidden) {
                    throw new errors_1.ApiError("You can't do anything on this site because you've been banned. Contact the administrator!", 403);
                }
            }
            const tokenInfo = await dataBase_1.Token.findOne({ accessToken });
            if (!tokenInfo) {
                throw new errors_1.ApiError("Token not valid!", 401);
            }
            req.res.locals = { jwtPayload, tokenInfo };
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async checkedRefreshToken(req, res, next) {
        try {
            const refreshToken = req.get("Authorization");
            if (!refreshToken) {
                throw new errors_1.ApiError("No token!", 401);
            }
            const jwtPayload = services_1.tokenService.checkToken(refreshToken);
            const tokenInfo = await dataBase_1.Token.findOne({ refreshToken });
            if (!tokenInfo) {
                throw new errors_1.ApiError("Token not valid!", 401);
            }
            req.res.locals = { jwtPayload, tokenInfo };
            next();
        }
        catch (e) {
            next(e);
        }
    }
    checkActionToken(type) {
        return async (req, res, next) => {
            try {
                const actionToken = req.params.token;
                if (!actionToken) {
                    throw new errors_1.ApiError("No token!", 401);
                }
                const jwtPayload = services_1.tokenService.checkActionToken(actionToken, type);
                const tokenInfo = await dataBase_1.Action.findOne({ actionToken });
                if (!tokenInfo) {
                    throw new errors_1.ApiError("Token not valid", 401);
                }
                req.res.locals = { tokenInfo, jwtPayload };
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.authMiddleware = new AuthMiddleware();
