"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCurrencyPrice = void 0;
const cron_1 = require("cron");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const services_1 = require("../services");
const dataBase_1 = require("../dataBase");
const enums_1 = require("../enums");
dayjs_1.default.extend(utc_1.default);
const convertCurrency = async () => {
    const previousDay = (0, dayjs_1.default)().utc().subtract(1, "day");
    const cars = await dataBase_1.Car.find({ updatedAt: { $lte: previousDay } });
    const updatePromises = [];
    cars.forEach((car) => {
        const convertedPrices = services_1.currencyExchangeService.convertCurrency(car.price, car.currency, [enums_1.ECurrency.UAH, enums_1.ECurrency.USD, enums_1.ECurrency.EUR]);
        const updatePromise = dataBase_1.Car.updateOne({ _id: car._id }, {
            $set: {
                convertedPriceUAH: convertedPrices[enums_1.ECurrency.UAH],
                convertedPriceEUR: convertedPrices[enums_1.ECurrency.EUR],
                convertedPriceUSD: convertedPrices[enums_1.ECurrency.USD]
            }
        });
        updatePromises.push(updatePromise);
    });
    await Promise.all(updatePromises);
};
exports.convertCurrencyPrice = new cron_1.CronJob("0 0 * * *", convertCurrency);
