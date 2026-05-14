import { calculateLoyaltyDiscount } from "../../src/services/calculateLoyaltyDiscount";

describe("calculateLoyaltyDiscount", () => {
  it("retourne 0 si points <= 100", () => {
    expect(calculateLoyaltyDiscount(50)).toBe(0);
  });

  it("applique 10% si points > 100", () => {
    expect(calculateLoyaltyDiscount(200)).toBe(20);
  });

  it("plafonne à 100", () => {
    expect(calculateLoyaltyDiscount(1000)).toBe(100);
  });
});
