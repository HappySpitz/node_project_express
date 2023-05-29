import { Types } from "mongoose";

import { Car } from "../dataBase";
import { ICar } from "../types";

class CarRepository {
    public async getByUserAndCar(userId: string, carId: string): Promise<ICar> {
        const result = await Car.aggregate([
            {
                $match: {
                    _id: carId,
                    seller: new Types.ObjectId(userId),
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

export const carRepository = new CarRepository();