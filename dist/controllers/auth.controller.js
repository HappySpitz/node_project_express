"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const services_1 = require("../services");
class AuthController {
    async registerSeller(req, res, next) {
        try {
            await services_1.authService.registerSeller(req.body);
            res.sendStatus(201);
        }
        catch (e) {
            next(e);
        }
    }
    async registerManager(req, res, next) {
        try {
            await services_1.authService.registerManager(req.body);
            res.sendStatus(201);
        }
        catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user } = req.res.locals;
            const tokenPair = await services_1.authService.login({ email, password }, user);
            return res.status(200).json(tokenPair);
        }
        catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const { tokenInfo, jwtPayload } = req.res.locals;
            const tokenPair = await services_1.authService.refresh(tokenInfo, jwtPayload);
            return res.status(200).json(tokenPair);
        }
        catch (e) {
            next(e);
        }
    }
    async sendActivateToken(req, res, next) {
        try {
            const { user } = req.res.locals;
            await services_1.authService.sendActivateToken(user);
            res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
    async changeTypeAccount(req, res, next) {
        try {
            const { _id } = req.res.locals.jwtPayload;
            await services_1.authService.changeTypeAccount(_id);
            res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.authController = new AuthController();
