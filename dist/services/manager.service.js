"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerService = void 0;
const errors_1 = require("../errors");
const dataBase_1 = require("../dataBase");
class ManagerService {
    async getWithPagination(query) {
        try {
            const queryStr = JSON.stringify(query);
            const queryObj = JSON.parse(queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`));
            const { page = 1, limit = 5, sortedBy = "createdAt", ...searchObject } = queryObj;
            const skip = limit * (page - 1);
            const managers = await dataBase_1.Manager.find(searchObject)
                .limit(limit)
                .skip(skip)
                .sort(sortedBy)
                .lean();
            const usersTotalCount = await dataBase_1.Manager.countDocuments(searchObject);
            return {
                page: +page,
                itemsCount: usersTotalCount,
                perPage: +limit,
                itemsFound: managers.length,
                data: managers
            };
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async getById(userId) {
        try {
            return await dataBase_1.Manager.findById(userId).lean();
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async update(userId, data) {
        try {
            return await dataBase_1.Manager.findByIdAndUpdate(userId, data, { new: true });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async delete(userId) {
        try {
            await dataBase_1.Manager.deleteOne({ _id: userId });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
}
exports.managerService = new ManagerService();
