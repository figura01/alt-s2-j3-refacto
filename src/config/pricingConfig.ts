import { PricingConfig } from "../types";

export const pricingConfig: PricingConfig = {
  taxRate: 0.2,
  freeShippingLimit: 50,
  defaultShipping: 5,
  loyaltyRatio: 0.01,
  handlingFee: 2.5,
  maxDiscount: 200,
  morningDiscountRate: 0.03,

  currencyRates: {
    EUR: 1,
    USD: 1.1,
    GBP: 0.85,
  },
} as const;
