class CurrencyExchangeService {
    private baseUrl: string;
    public constructor() {
        this.baseUrl = `${process.env.CURRENCY_EXCHANGE_API_URL || ''}?apikey=${process.env.CURRENCY_EXCHANGE_API_KEY || ''}`;
    }

    // only works with USD as base currency
    async getConversionRates(baseCurrencyCode: string) {
        try {
            const response = await fetch(`${this.baseUrl}&symbols=RON,USD,EUR&base=${baseCurrencyCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data, 'data')
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}

const currencyExchangeService = new CurrencyExchangeService();

export default currencyExchangeService;