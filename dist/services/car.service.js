"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carService = void 0;
const dataBase_1 = require("../dataBase");
const errors_1 = require("../errors");
const mongoose_1 = require("mongoose");
const leo_profanity_1 = __importDefault(require("leo-profanity"));
const s3_service_1 = require("./s3.service");
const constants_1 = require("../constants");
const enums_1 = require("../enums");
const repositories_1 = require("../repositories");
const mappers_1 = require("../mappers");
const email_service_1 = require("./email.service");
class CarService {
    async getWithPagination(query) {
        try {
            const queryStr = JSON.stringify(query);
            const queryObj = JSON.parse(queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`));
            const { page = 1, limit = 10, sortedBy = "createdAt", ...searchObject } = queryObj;
            const skip = limit * (page - 1);
            const cars = await dataBase_1.Car.find(searchObject)
                .limit(limit)
                .skip(skip)
                .sort(sortedBy)
                .lean();
            const carsTotalCount = await dataBase_1.Car.countDocuments(searchObject);
            return {
                page: +page,
                itemsCount: carsTotalCount,
                perPage: +limit,
                itemsFound: cars.length,
                data: cars
            };
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async getById(userId, carId) {
        try {
            const car = await dataBase_1.Car.findById(carId);
            await exports.carService.increaseViewsCount(carId);
            const carSellerId = car.seller.toString();
            if (carSellerId === userId) {
                const seller = await dataBase_1.Seller.findById(userId);
                if (seller.type === enums_1.ETypesSeller.premium) {
                    return mappers_1.carMapper.toResponse(car);
                }
                else {
                    return repositories_1.carRepository.getByUserAndCar(userId, carId);
                }
            }
            return repositories_1.carRepository.getByUserAndCar(carSellerId, carId);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async create(data, userId) {
        try {
            const { brand, model } = data;
            if (!(brand in constants_1.carModelsConstants)) {
                await email_service_1.emailService.sendMail("tatarkristina4@gmail.com", enums_1.EEmailActions.ADD_BRAND, { brand });
                throw new errors_1.ApiError('Invalid car brand', 400);
            }
            const availableModels = constants_1.carModelsConstants[brand];
            if (!availableModels.includes(model)) {
                await email_service_1.emailService.sendMail("tatarkristina4@gmail.com", enums_1.EEmailActions.ADD_MODEL, { model });
                throw new errors_1.ApiError('Invalid car model for the selected brand', 400);
            }
            const car = await dataBase_1.Car.create({
                ...data,
                seller: new mongoose_1.Types.ObjectId(userId),
                views: 0,
                viewsByPeriod: 0,
                averagePrice: 0,
                averagePriceInUkraine: 0,
                convertedPriceUAH: 0,
                convertedPriceUSD: 0,
                convertedPriceEUR: 0
            });
            if (await exports.carService.checkProfanity(car.text)) {
                throw new errors_1.ApiError('The ad contains profanity. Please edit your ad.', 404);
            }
            if (await exports.carService.checkProfanity(car.text)) {
                throw new errors_1.ApiError('The ad contains profanity. Please edit your ad.', 404);
            }
            if (await exports.carService.checkProfanity(car.text)) {
                await email_service_1.emailService.sendMail("tatarkristina4@gmail.com", enums_1.EEmailActions.AD_VERIFICATION, { text: car.text });
                throw new errors_1.ApiError('The ad contains profanity. Please edit your ad.', 404);
            }
            await dataBase_1.Car.findByIdAndUpdate(car._id, { $set: { isActive: enums_1.EStatus.active } });
            return car;
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async uploadPhoto(file, car) {
        try {
            const filePath = await s3_service_1.s3Service.uploadPhoto(file, "car", car._id);
            return await dataBase_1.Car.findByIdAndUpdate(car._id, { photo: filePath }, { new: true });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async deletePhoto(car) {
        try {
            const { photo } = car;
            if (!photo) {
                throw new errors_1.ApiError("Car doesnt have photo", 422);
            }
            for (const onePhoto of photo) {
                await s3_service_1.s3Service.deletePhoto(onePhoto);
                return await dataBase_1.Car.findByIdAndUpdate(car._id, { $unset: { photo: true } }, { new: true });
            }
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async increaseViewsCount(carId) {
        try {
            return await dataBase_1.Car.findByIdAndUpdate(carId, { $inc: { views: 1 } });
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
    async checkProfanity(text) {
        try {
            return leo_profanity_1.default.check(text);
        }
        catch (e) {
            throw new errors_1.ApiError(e.message, e.status);
        }
    }
}
exports.carService = new CarService();
