"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronRunner = void 0;
const convert_currency_cron_1 = require("./convert.currency.cron");
const cronRunner = () => {
    convert_currency_cron_1.convertCurrencyPrice.start();
};
exports.cronRunner = cronRunner;
