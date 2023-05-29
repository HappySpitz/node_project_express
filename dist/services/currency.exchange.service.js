"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyExchangeService = void 0;
const axios_1 = __importDefault(require("axios"));
class CurrencyExchangeService {
    async convertCurrency(price, inputCurrency, outputCurrencies) {
        try {
            const response = await axios_1.default.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
            const currencyData = response.data;
            const inputCurrencyRate = currencyData.find((currency) => currency.ccy === inputCurrency);
            if (!inputCurrencyRate) {
                throw new Error(`Input currency ${inputCurrency} is not supported`);
            }
            const conversionPromises = outputCurrencies.map(async (outputCurrency) => {
                const outputCurrencyRate = currencyData.find((currency) => currency.ccy === outputCurrency);
                if (!outputCurrencyRate) {
                    throw new Error(`Output currency ${outputCurrency} is not supported`);
                }
                const convertedPrice = (price * parseFloat(outputCurrencyRate.buy)) / parseFloat(inputCurrencyRate.sale);
                return { currency: outputCurrency, convertedPrice };
            });
            return await Promise.all(conversionPromises);
        }
        catch (error) {
            console.error('Currency conversion failed:', error);
            throw new Error('Currency conversion failed');
        }
    }
}
;
exports.currencyExchangeService = new CurrencyExchangeService();
