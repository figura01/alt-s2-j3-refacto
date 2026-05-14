import { capDiscounts } from "../../src/services/capDiscounts";

describe("capDiscounts", () => {
  it("ne modifie pas si total < 200", () => {
    const result = capDiscounts(100, 50);

    expect(result.totalDiscount).toBe(150);
  });

  it("plafonne à 200", () => {
    const result = capDiscounts(180, 80);

    expect(result.totalDiscount).toBe(200);
  });
});
