import axios from "axios";
import {ICurrency} from "../types";

class CurrencyExchangeService {
    public async convertCurrency(price: number, inputCurrency: string, outputCurrencies: string[]): Promise<{ currency: string; convertedPrice: number }[]> {
        try {
            const response = await axios.get<ICurrency[]>('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
            const currencyData = response.data;

            const inputCurrencyRate = currencyData.find((currency: ICurrency): boolean => currency.ccy === inputCurrency);
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
        } catch (error) {
            console.error('Currency conversion failed:', error);
            throw new Error('Currency conversion failed');
        }
    }
};

export const currencyExchangeService = new CurrencyExchangeService();
