import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Car } from "../dataBase";
import { ECurrency } from "../enums";
import { currencyExchangeService } from "../services";

dayjs.extend(utc);
const convertCurrency = async (): Promise<void> => {
  const previousDay = dayjs().utc().subtract(1, "day");

  const cars = await Car.find({ updatedAt: { $lte: previousDay } });

  const updatePromises: Promise<any>[] = [];

  cars.forEach((car) => {
    const convertedPrices = currencyExchangeService.convertCurrency(
      car.price as number,
      car.currency as string,
      [ECurrency.UAH, ECurrency.USD, ECurrency.EUR]
    );

    const updatePromise = Car.updateOne(
      { _id: car._id },
      {
        $set: {
          convertedPriceUAH: convertedPrices[ECurrency.UAH as ECurrency],
          convertedPriceEUR: convertedPrices[ECurrency.EUR as ECurrency],
          convertedPriceUSD: convertedPrices[ECurrency.USD as ECurrency],
        },
      }
    );

    updatePromises.push(updatePromise);
  });

  await Promise.all(updatePromises);
};

export const convertCurrencyPrice = new CronJob("0 0 * * *", convertCurrency);
