import { UploadedFile } from "express-fileupload";
import Profanity from "leo-profanity";
import { Types } from "mongoose";

import { carModelsConstants } from "../constants";
import { Car, Seller } from "../dataBase";
import {
  EBrands,
  EEmailActions,
  EModels,
  EStatus,
  ETypesSeller,
} from "../enums";
import { ApiError } from "../errors";
import { carMapper } from "../mappers";
import { carRepository } from "../repositories";
import { ICar, IPaginationResponse, IQuery, ISeller } from "../types";
import { emailService } from "./email.service";
import { s3Service } from "./s3.service";

class CarService {
  public async getWithPagination(
    query: IQuery
  ): Promise<IPaginationResponse<ICar>> {
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

      const cars = await Car.find<ICar>(searchObject)
        .limit(limit)
        .skip(skip)
        .sort(sortedBy)
        .lean();

      const carsTotalCount = await Car.countDocuments(searchObject);

      return {
        page: +page,
        itemsCount: carsTotalCount,
        perPage: +limit,
        itemsFound: cars.length,
        data: cars,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getById(carId: string, userId?: string, ): Promise<ICar> {
    try {
      const car: ICar = await Car.findById(carId);
      await carService.increaseViewsCount(carId);
      const carSellerId = car.seller.toString();

      if (userId && carSellerId === userId) {
        const seller: ISeller = await Seller.findById(userId);

        if (seller.type === ETypesSeller.premium) {
          return carMapper.toResponse(car as ICar);
        } else {
          return carRepository.getByUserAndCar(userId, carId);
        }
      } else {
        return carRepository.getByUserAndCar(carSellerId, carId);
      }

      return carRepository.getByUserAndCar(carSellerId, carId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(
    data: ICar,
    userId: string | Types.ObjectId
  ): Promise<any> {
    try {
      const { brand, model } = data;

      if (!(brand in carModelsConstants)) {
        await emailService.sendMail(
          "tatarkristina4@gmail.com",
          EEmailActions.ADD_BRAND,
          { brand }
        );
        throw new ApiError("Invalid car brand", 400);
      }

      const availableModels = carModelsConstants[brand as EBrands];

      if (!availableModels.includes(model as EModels)) {
        await emailService.sendMail(
          "tatarkristina4@gmail.com",
          EEmailActions.ADD_MODEL,
          { model }
        );
        throw new ApiError("Invalid car model for the selected brand", 400);
      }

      const car = await Car.create({
        ...data,
        seller: new Types.ObjectId(userId),
        views: 0,
        viewsByPeriod: 0,
        averagePrice: 0,
        averagePriceInUkraine: 0,
        convertedPriceUAH: 0,
        convertedPriceUSD: 0,
        convertedPriceEUR: 0,
      });

      if (await carService.checkProfanity(car.text as string)) {
        throw new ApiError(
          "The ad contains profanity. Please edit your ad.",
          404
        );
      }

      if (await carService.checkProfanity(car.text as string)) {
        throw new ApiError(
          "The ad contains profanity. Please edit your ad.",
          404
        );
      }

      if (await carService.checkProfanity(car.text as string)) {
        await emailService.sendMail(
          "tatarkristina4@gmail.com",
          EEmailActions.AD_VERIFICATION,
          { text: car.text as string }
        );
        throw new ApiError(
          "The ad contains profanity. Please edit your ad.",
          404
        );
      }

      await Car.findByIdAndUpdate(car._id, {
        $set: { isActive: EStatus.active },
      });

      return car;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async uploadPhoto(file: UploadedFile, car: ICar): Promise<ICar> {
    try {
      const filePath = await s3Service.uploadPhoto(file, "car", car._id);

      return await Car.findByIdAndUpdate(
        car._id,
        { photo: filePath },
        { new: true }
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async deletePhoto(car: ICar): Promise<ICar> {
    try {
      const { photo } = car;

      if (!photo) {
        throw new ApiError("Car doesnt have photo", 422);
      }

      for (const onePhoto of photo) {
        await s3Service.deletePhoto(onePhoto);

        return await Car.findByIdAndUpdate(
          car._id,
          { $unset: { photo: true } },
          { new: true }
        );
      }
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async increaseViewsCount(carId: string): Promise<void> {
    try {
      return await Car.findByIdAndUpdate(carId, { $inc: { views: 1 } });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async checkProfanity(text: string): Promise<boolean> {
    try {
      return Profanity.check(text);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const carService = new CarService();
