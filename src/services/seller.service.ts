import { ApiError } from "../errors";
import {IPaginationResponse, IQuery, ISeller} from "../types";
import {Seller} from "../dataBase";
import {s3Service} from "./s3.service";
import {UploadedFile} from "express-fileupload";

class SellerService {
    public async getWithPagination(query: IQuery): Promise<IPaginationResponse<ISeller>> {
        try {
            const queryStr = JSON.stringify(query);
            const queryObj = JSON.parse(
                queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`)
            );

            const {
                page = 1,
                limit = 10,
                sortedBy = "createdAt",
                ...searchObject
            } = queryObj;

            const skip = limit * (page - 1);

            const sellers = await Seller.find(searchObject)
                .limit(limit)
                .skip(skip)
                .sort(sortedBy)
                .lean();

            const usersTotalCount = await Seller.countDocuments(searchObject);

            return {
                page: +page,
                itemsCount: usersTotalCount,
                perPage: +limit,
                itemsFound: sellers.length,
                data: sellers
            };
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async getById(userId: string): Promise<ISeller> {
        try {
            return await Seller.findById(userId).lean()
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async update(userId: string, data: Partial<ISeller>): Promise<ISeller> {
        try {
            return await Seller.findByIdAndUpdate(userId, data, {new: true});
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async delete(userId: string): Promise<void> {
        try {
            await Seller.deleteOne({_id: userId});
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async uploadAvatar(file: UploadedFile, seller: ISeller): Promise<ISeller> {
        try {
            const filePath = await s3Service.uploadPhoto(file, "seller", seller._id);

            if (seller.avatar) {
                await s3Service.deletePhoto(seller.avatar);
            }

            return await Seller.findByIdAndUpdate(
                seller._id,
                { avatar: filePath },
                { new: true }
            );
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async deleteAvatar(seller: ISeller): Promise<ISeller> {
        try {
            if (!seller.avatar) {
                throw new ApiError("User doesnt have avatar", 422);
            }

            await s3Service.deletePhoto(seller.avatar);

            return await Seller.findByIdAndUpdate(
                seller._id,
                { $unset: { avatar: true } },
                { new: true }
            );
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }
}

export const sellerService = new SellerService();
