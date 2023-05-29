"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerController = void 0;
const services_1 = require("../services");
const mappers_1 = require("../mappers");
class SellerController {
    async getAll(req, res, next) {
        try {
            const response = await services_1.sellerService.getWithPagination(req.query);
            return res.json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async getById(req, res, next) {
        try {
            const { seller } = res.locals;
            const response = mappers_1.sellerMapper.toResponse(seller);
            return res.json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async update(req, res, next) {
        try {
            const { params, body } = req;
            const updatedSeller = await services_1.sellerService.update(params.userId, body);
            const response = mappers_1.sellerMapper.toResponse(updatedSeller);
            return res.status(201).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        try {
            const { userId } = req.params;
            await services_1.sellerService.delete(userId);
            return res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
    async uploadAvatar(req, res, next) {
        try {
            const userEntity = res.locals.user;
            const avatar = req.files.avatar;
            const user = await services_1.sellerService.uploadAvatar(avatar, userEntity);
            const response = mappers_1.sellerMapper.toResponse(user);
            return res.status(201).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async deleteAvatar(req, res, next) {
        try {
            const userEntity = res.locals.user;
            const user = await services_1.sellerService.deleteAvatar(userEntity);
            const response = mappers_1.sellerMapper.toResponse(user);
            return res.status(201).json(response);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.sellerController = new SellerController();
