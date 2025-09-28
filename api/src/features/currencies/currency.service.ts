export type BaseExchangeRateResponse = {
  result: "success" | "error";
};

export type ErrorExchangeRateResponse = BaseExchangeRateResponse & {
  result: "error";
  error_type: string;
};

export type SuccessExchangeRateResponse = BaseExchangeRateResponse & {
  result: "success";
  time_last_update_unix: number;
  time_last_update_utc: Date;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
  conversion_result: number;
};

export interface ICurrencyService {
  getConversionRate(
    baseCurrency: string,
    targetCurrency: string
  ): Promise<{
    baseCurrency: string;
    targetCurrency: string;
    rate: number | null;
    success: boolean;
    error?: string;
  }>;
  getAllCurrencyPairs(currencies: string[]): Promise<
    {
      baseCurrency: string;
      targetCurrency: string;
      rate: number | null;
      success: boolean;
      error?: string;
    }[]
  >;
}

class CurrencyService implements ICurrencyService {
  private static baseUrl: string;

  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    CurrencyService.baseUrl = "https://v6.exchangerate-api.com/v6";
  }

  async getConversionRate(baseCurrency: string, targetCurrency: string) {
    try {
      const url = `${CurrencyService.baseUrl}/${this.apiKey}/pair/${baseCurrency}/${targetCurrency}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await response.json()) as
        | SuccessExchangeRateResponse
        | ErrorExchangeRateResponse;

      if (data.result === "success") {
        return {
          baseCurrency,
          targetCurrency,
          rate: data.conversion_rate,
          success: true,
        };
      } else {
        throw new Error(`API Error: ${data.error_type || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error(
        `Failed to fetch ${baseCurrency}/${targetCurrency}:`,
        error.message
      );
      return {
        baseCurrency,
        targetCurrency,
        rate: null,
        success: false,
        error: error.message,
      };
    }
  }

  async getAllCurrencyPairs(currencies: string[]) {
    const pairs = [];
    const results = [];

    // Generate all unique pairs
    for (let i = 0; i < currencies.length; i++) {
      for (let j = 0; j < currencies.length; j++) {
        if (i !== j) {
          pairs.push([currencies[i], currencies[j]]);
        }
      }
    }

    for (const [base, target] of pairs) {
      const result = await this.getConversionRate(base, target);
      results.push(result);

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    return results;
  }
}
