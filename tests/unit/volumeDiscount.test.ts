import { calculateVolumeDiscount } from "../../src/services/calculateVolumeDiscount";

describe("calculateVolumeDiscount", () => {
  it("applique 5% si subtotal > 50", () => {
    const result = calculateVolumeDiscount(60, "BASIC", "2025-03-10");

    expect(result).toBe(3);
  });

  it("applique 10% si subtotal > 100", () => {
    const result = calculateVolumeDiscount(200, "BASIC", "2025-03-10");

    expect(result).toBe(20);
  });

  it("applique 20% si PREMIUM > 1000", () => {
    const result = calculateVolumeDiscount(1200, "PREMIUM", "2025-03-10");

    expect(result).toBe(240);
  });
});
