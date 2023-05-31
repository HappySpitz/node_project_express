import moment from "moment";
import { Types } from "mongoose";

import { Car } from "../dataBase";

class AdditionalInformationService {
  public async getAdViews(carId: Types.ObjectId): Promise<number> {
    const views = await Car.aggregate([
      { $match: { _id: carId } },
      { $project: { views: 1 } },
    ]);

    return views[0]?.views || 0;
  }

  public async getAdViewsByPeriod(carId: Types.ObjectId): Promise<number> {
    const startOfDay = moment().startOf("day").toDate();
    const startOfPreviousDay = moment()
      .subtract(1, "day")
      .startOf("day")
      .toDate();
    const startOfPreviousWeek = moment()
      .subtract(1, "week")
      .startOf("week")
      .toDate();
    const startOfPreviousMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();

    const views = await Car.aggregate([
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

  public async getAveragePriceByRegion(region: string): Promise<number> {
    const averagePrice = await Car.aggregate([
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

  public async getAveragePriceInUkraine(): Promise<number> {
    const averagePrice = await Car.aggregate([
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

export const additionalInformationService = new AdditionalInformationService();
