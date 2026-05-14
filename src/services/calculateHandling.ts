import { pricingConfig } from "../config/pricingConfig";

export function calculateHandling(itemCount: number): number {
  let handling = 0;

  if (itemCount > 10) {
    handling = pricingConfig.handlingFee;
  }

  if (itemCount > 20) {
    handling = pricingConfig.handlingFee * 2;
  }

  return handling;
}
