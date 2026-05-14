import { calculateShipping } from "../../src/services/calculateShipping";

describe("calculateShipping", () => {
  it("retourne 0 si subtotal >= 50 et poids <= 20", () => {
    const result = calculateShipping(100, 10, "ZONE1", {
      zone: "ZONE1",
      base: 5,
      perKg: 0.5,
    });

    expect(result).toBe(0);
  });

  it("applique surcharge si subtotal >= 50 et poids > 20", () => {
    const result = calculateShipping(100, 25, "ZONE1", {
      zone: "ZONE1",
      base: 5,
      perKg: 0.5,
    });

    expect(result).toBe(1.25);
  });

  it("applique majoration zone éloignée", () => {
    const result = calculateShipping(20, 4, "ZONE3", {
      zone: "ZONE3",
      base: 5,
      perKg: 0.5,
    });

    expect(result).toBe(6);
  });
});
