"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerService = void 0;
const errors_1 = require("../errors");
const dataBase_1 = require("../dataBase");
const s3_service_1 = require("./s3.service");
class SellerService {
    async getWithPagination(query) {
        try {
            const queryStr = JSON.stringify(query);
            const queryObj = JSON.parse(queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`));
            const { page = 1, limit = 10, sortedBy = "createdAt", ...searchObject } = queryObj;
            const skip = limit * (page - 1);
            const sellers = await dataBase_1.Seller.find(searchObject)
                .limit(limit)
                .skip(skip)
                .sort(sortedBy)
                .lean();
            const usersTotalCount = await dataBase_1.Seller.countDocuments(searchObject);
            return {
                page: +page,
                itemsCount: usersTotalCount,
                perPage: +limit,
                itemsFound: sellers.length,
                data: sellers
            };
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async getById(userId) {
        try {
            return await dataBase_1.Seller.findById(userId).lean();
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async update(userId, data) {
        try {
            return await dataBase_1.Seller.findByIdAndUpdate(userId, data, { new: true });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async delete(userId) {
        try {
            await dataBase_1.Seller.deleteOne({ _id: userId });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async uploadAvatar(file, seller) {
        try {
            const filePath = await s3_service_1.s3Service.uploadPhoto(file, "seller", seller._id);
            if (seller.avatar) {
                await s3_service_1.s3Service.deletePhoto(seller.avatar);
            }
            return await dataBase_1.Seller.findByIdAndUpdate(seller._id, { avatar: filePath }, { new: true });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async deleteAvatar(seller) {
        try {
            if (!seller.avatar) {
                throw new errors_1.ApiError("User doesnt have avatar", 422);
            }
            await s3_service_1.s3Service.deletePhoto(seller.avatar);
            return await dataBase_1.Seller.findByIdAndUpdate(seller._id, { $unset: { avatar: true } }, { new: true });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
}
exports.sellerService = new SellerService();
