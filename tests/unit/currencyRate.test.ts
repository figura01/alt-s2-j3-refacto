import { calculateCurrencyRate } from "../../src/services/calculateCurrencyRate";

describe("calculateCurrencyRate", () => {
  it("retourne 1 pour EUR", () => {
    expect(calculateCurrencyRate("EUR")).toBe(1);
  });

  it("retourne 1.1 pour USD", () => {
    expect(calculateCurrencyRate("USD")).toBe(1.1);
  });

  it("retourne 0.85 pour GBP", () => {
    expect(calculateCurrencyRate("GBP")).toBe(0.85);
  });
});
