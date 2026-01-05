import cron from 'node-cron';
import { JobFunction } from './types';
import { Currency } from '../src/features/currencies/currency';
import currencyExchangeService from '../src/config/currencyExchange/currencyExchangeService';
import { CurrencyExchange } from '../src/features/currencies/exchange/currencyExchange';
import { Op } from 'sequelize';

const currenciesExchangeJob: JobFunction[] = [
    {
        rate: '*/20 * * * * *',
        fn: () => {
            // syncCurrenciesExchangeRate();
        }
    },
]

const syncCurrenciesExchangeRate = async () => {
    const currencies = await Currency.findAll();
    const ratesUSD = await currencyExchangeService.getConversionRates("USD");

    for (let i = 0; i < currencies.length; i++) {
        const baseCurrency = currencies[i];
        for (let j = i + 1; j < currencies.length; j++) {
            const targetCurrency = currencies[j];
            if (targetCurrency.code !== "USD" && baseCurrency.code !== "USD") {
                const rate = parseFloat(ratesUSD.rates[targetCurrency.code]) / parseFloat(ratesUSD.rates[baseCurrency.code]);
                await CurrencyExchange.upsert({
                    baseCurrencyCode: baseCurrency.code,
                    targetCurrencyCode: targetCurrency.code,
                    rateDate: new Date(),
                    rate: rate,
                    source: "CurrencyExchangeService - external API",
                    syncDate: new Date(),
                });
            } else {
                const targetCurrencyCode = targetCurrency.code === "USD" ? baseCurrency.code : targetCurrency.code;
                const rate = parseFloat(ratesUSD.rates[targetCurrencyCode]);
                await CurrencyExchange.upsert({
                    baseCurrencyCode: "USD",
                    targetCurrencyCode: targetCurrencyCode,
                    rateDate: new Date(),
                    rate: rate,
                    source: "CurrencyExchangeService - external API",
                    syncDate: new Date(),
                });
            }
        }
    }
}

export default currenciesExchangeJob;