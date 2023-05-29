"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerController = void 0;
const services_1 = require("../services");
class ManagerController {
    async getAll(req, res, next) {
        try {
            const response = await services_1.managerService.getWithPagination(req.query);
            return res.json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async getById(req, res, next) {
        try {
            const { params } = req;
            const manager = await services_1.managerService.getById(params.userId);
            return res.json(manager);
        }
        catch (e) {
            next(e);
        }
    }
    async update(req, res, next) {
        try {
            const { params, body } = req;
            const updatedManager = await services_1.managerService.update(params.userId, body);
            return res.status(201).json(updatedManager);
        }
        catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        try {
            const { userId } = req.params;
            await services_1.managerService.delete(userId);
            return res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.managerController = new ManagerController();
