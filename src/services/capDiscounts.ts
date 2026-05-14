import { pricingConfig } from "../config/pricingConfig";

export function capDiscounts(
  volumeDiscount: number,
  loyaltyDiscount: number,
): {
  totalDiscount: number;
  volumeDiscount: number;
  loyaltyDiscount: number;
} {
  let totalDiscount = volumeDiscount + loyaltyDiscount;

  if (totalDiscount > pricingConfig.maxDiscount) {
    totalDiscount = pricingConfig.maxDiscount;

    const ratio =
      pricingConfig.maxDiscount / (volumeDiscount + loyaltyDiscount);

    volumeDiscount = volumeDiscount * ratio;
    loyaltyDiscount = loyaltyDiscount * ratio;
  }

  return {
    totalDiscount,
    volumeDiscount,
    loyaltyDiscount,
  };
}
