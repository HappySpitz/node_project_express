"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carMiddleware = void 0;
const dataBase_1 = require("../dataBase");
const errors_1 = require("../errors");
class CarMiddleware {
    async getByIdOrThrow(req, res, next) {
        try {
            const { carId } = req.params;
            const car = await dataBase_1.Car.findById(carId);
            if (!car) {
                throw new errors_1.ApiError("Car not found!", 422);
            }
            res.locals.car = car;
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.carMiddleware = new CarMiddleware();
