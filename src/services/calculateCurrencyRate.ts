import { pricingConfig } from "../config/pricingConfig";

export function calculateCurrencyRate(currency: string): number {
  if (currency === "USD") {
    return pricingConfig.currencyRates.USD;
  }

  if (currency === "GBP") {
    return pricingConfig.currencyRates.GBP;
  }

  return 1;
}
