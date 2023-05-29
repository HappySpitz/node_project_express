"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.additionalInformationService = void 0;
const moment_1 = __importDefault(require("moment"));
const dataBase_1 = require("../dataBase");
class AdditionalInformationService {
    async getAdViews(carId) {
        const views = await dataBase_1.Car.aggregate([
            { $match: { _id: carId } },
            { $project: { views: 1 } },
        ]);
        return views[0]?.views || 0;
    }
    async getAdViewsByPeriod(carId) {
        const startOfDay = (0, moment_1.default)().startOf('day').toDate();
        const startOfPreviousDay = (0, moment_1.default)().subtract(1, "day").startOf("day").toDate();
        const startOfPreviousWeek = (0, moment_1.default)().subtract(1, "week").startOf("week").toDate();
        const startOfPreviousMonth = (0, moment_1.default)().subtract(1, "month").startOf("month").toDate();
        const views = await dataBase_1.Car.aggregate([
            { $match: { _id: carId } },
            { $unwind: "$views" },
            {
                $match: {
                    "views.date.day": { $gte: startOfPreviousDay, $lte: startOfDay },
                    "views.date.week": { $gte: startOfPreviousWeek, $lte: startOfDay },
                    "views.date.month": { $gte: startOfPreviousMonth, $lte: startOfDay },
                },
            },
            { $group: { _id: null, totalViews: { $sum: "$views.count" } } },
        ]);
        return views[0]?.totalViews || 0;
    }
    async getAveragePriceByRegion(region) {
        const averagePrice = await dataBase_1.Car.aggregate([
            {
                $match: {
                    region: region,
                    price: { $exists: true },
                },
            },
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: "$price" },
                },
            },
        ]);
        return averagePrice[0]?.averagePrice || 0;
    }
    async getAveragePriceInUkraine() {
        const averagePrice = await dataBase_1.Car.aggregate([
            {
                $match: {
                    price: { $exists: true },
                },
            },
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: "$price" },
                },
            },
        ]);
        return averagePrice[0]?.averagePrice || 0;
    }
}
exports.additionalInformationService = new AdditionalInformationService();
