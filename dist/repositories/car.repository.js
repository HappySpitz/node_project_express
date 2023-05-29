"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRepository = void 0;
const mongoose_1 = require("mongoose");
const dataBase_1 = require("../dataBase");
class CarRepository {
    async getByUserAndCar(userId, carId) {
        const result = await dataBase_1.Car.aggregate([
            {
                $match: {
                    _id: carId,
                    seller: new mongoose_1.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "sellers",
                    localField: "seller",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            {
                $unwind: {
                    path: "$seller",
                },
            },
            {
                $project: {
                    "seller.password": 0,
                    views: 0,
                    viewsByPeriod: 0,
                    averagePrice: 0,
                    averagePriceInUkraine: 0,
                }
            }
        ]);
        return result[0];
    }
}
exports.carRepository = new CarRepository();
