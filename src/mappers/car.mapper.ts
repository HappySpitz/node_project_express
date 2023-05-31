import { configs } from "../configs";
import { additionalInformationService } from "../services";
import { ICar, ICarResponse } from "../types";

export class CarMapper {
  public toResponse(car: ICar): ICarResponse {
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
      photo: car.photo ? `${configs.AWS_S3_URL}/${car.photo}` : null,
      views: additionalInformationService.getAdViews(car._id),
      viewsByPeriod: additionalInformationService.getAdViewsByPeriod(car._id),
      averagePrice: additionalInformationService.getAveragePriceByRegion(
        car.region
      ),
      averagePriceInUkraine:
        additionalInformationService.getAveragePriceInUkraine(),
    };
  }
}

export const carMapper = new CarMapper();
