import {convertCurrencyPrice} from "./convert.currency.cron";

export const cronRunner = () => {
    convertCurrencyPrice.start();
}