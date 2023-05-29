"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carMapper = exports.CarMapper = void 0;
const configs_1 = require("../configs");
const services_1 = require("../services");
class CarMapper {
    toResponse(car) {
        return {
            _id: car._id,
            type: car.type,
            brand: car.brand,
            model: car.model,
            price: car.price,
            currency: car.currency,
            region: car.region,
            text: car.text,
            year: car.year,
            color: car.color,
            isActive: car.isActive,
            seller: car.seller,
            photo: car.photo ? `${configs_1.configs.AWS_S3_URL}/${car.photo}` : null,
            views: services_1.additionalInformationService.getAdViews(car._id),
            viewsByPeriod: services_1.additionalInformationService.getAdViewsByPeriod(car._id),
            averagePrice: services_1.additionalInformationService.getAveragePriceByRegion(car.region),
            averagePriceInUkraine: services_1.additionalInformationService.getAveragePriceInUkraine()
        };
    }
}
exports.CarMapper = CarMapper;
exports.carMapper = new CarMapper();
