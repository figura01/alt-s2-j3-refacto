export function calculateLoyaltyDiscount(points: number): number {
  let loyaltyDiscount = 0;

  if (points > 100) {
    loyaltyDiscount = Math.min(points * 0.1, 50);
  }

  if (points > 500) {
    loyaltyDiscount = Math.min(points * 0.15, 100);
  }

  return loyaltyDiscount;
}
