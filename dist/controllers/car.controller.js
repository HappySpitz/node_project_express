"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const services_1 = require("../services");
const dataBase_1 = require("../dataBase");
const errors_1 = require("../errors");
const enums_1 = require("../enums");
class CarController {
    async getAll(req, res, next) {
        try {
            const response = await services_1.carService.getWithPagination(req.query);
            return res.json(response);
        }
        catch (e) {
            next(e);
        }
    }
    async getById(req, res, next) {
        try {
            const { car, jwtPayload } = res.locals;
            const result = await services_1.carService.getById(jwtPayload._id, car._id);
            return res.json(result);
        }
        catch (e) {
            next(e);
        }
    }
    async create(req, res, next) {
        try {
            const { _id } = req.res.locals.jwtPayload;
            const cars = await dataBase_1.Car.find({ seller: _id });
            const seller = await dataBase_1.Seller.findById(_id);
            if (seller.type === enums_1.ETypesSeller.basic && cars.length >= 1) {
                throw new errors_1.ApiError("You can only create one ad!", 404);
            }
            const car = await services_1.carService.create(req.body, _id);
            return res.status(201).json(car);
        }
        catch (e) {
            next(e);
        }
    }
    async update(req, res, next) {
        try {
            const { carId } = req.params;
            const updatedCar = await dataBase_1.Car.findByIdAndUpdate(carId, { ...req.body }, { new: true });
            return res.status(201).json(updatedCar);
        }
        catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        try {
            const { carId } = req.params;
            await dataBase_1.Car.deleteOne({ _id: carId });
            return res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
    async uploadPhoto(req, res, next) {
        try {
            const carEntity = res.locals.car;
            const photo = req.files.photo;
            const car = await services_1.carService.uploadPhoto(photo, carEntity);
            return res.status(201).json(car);
        }
        catch (e) {
            next(e);
        }
    }
    async deletePhoto(req, res, next) {
        try {
            const carEntity = res.locals.car;
            const car = await services_1.carService.deletePhoto(carEntity);
            return res.status(201).json(car);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.carController = new CarController();
