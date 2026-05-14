import { calculateHandling } from "../../src/services/calculateHandling";

describe("calculateHandling", () => {
  it("retourne 0 si <= 10 items", () => {
    expect(calculateHandling(5)).toBe(0);
  });

  it("retourne 2.5 si > 10 items", () => {
    expect(calculateHandling(11)).toBe(2.5);
  });

  it("retourne 5 si > 20 items", () => {
    expect(calculateHandling(21)).toBe(5);
  });
});
