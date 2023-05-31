import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { Car, Seller } from "../dataBase";
import { ETypesSeller } from "../enums";
import { ApiError } from "../errors";
import { carService } from "../services";
import { ICar, ICommentResponse, IQuery, ITokenPayload } from "../types";

class CarController {
  public async getAll(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<ICar[]>> {
    try {
      const response = await carService.getWithPagination(
          req.query as unknown as IQuery
      );

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async getById(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<ICar>> {
    try {
      const { car, jwtPayload } = res.locals;

      let result;
      if (jwtPayload) {
        result = await carService.getById(car._id, jwtPayload._id);
      } else {
        result = await carService.getById(car._id);
      }

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async create(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<ICommentResponse<ICar>>> {
    try {
      const { _id } = req.res.locals.jwtPayload as ITokenPayload;
      const cars = await Car.find({ seller: _id });
      const seller = await Seller.findById(_id);

      if (seller.type === ETypesSeller.basic && cars.length >= 1) {
        throw new ApiError("You can only create one ad!", 404);
      }

      const car = await carService.create(req.body, _id);

      return res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }

  public async update(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<ICommentResponse<ICar>>> {
    try {
      const { carId } = req.params;

      const updatedCar = await Car.findByIdAndUpdate(
          carId,
          { ...req.body },
          { new: true }
      );

      return res.status(201).json(updatedCar);
    } catch (e) {
      next(e);
    }
  }

  public async delete(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { carId } = req.params;

      await Car.deleteOne({ _id: carId });

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async uploadPhoto(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<ICar>> {
    try {
      const carEntity = res.locals.car as ICar;
      const photo = req.files.photo as UploadedFile;

      const car = await carService.uploadPhoto(photo, carEntity);

      return res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }

  public async deletePhoto(
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response<ICar>> {
    try {
      const carEntity = res.locals.car as ICar;

      const car = await carService.deletePhoto(carEntity);

      return res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();