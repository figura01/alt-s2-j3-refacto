import { calculateTax } from "../../src/services/calculateTax";

describe("calculateTax", () => {
  it("retourne 20% si tous taxables", () => {
    const result = calculateTax(
      100,
      [
        {
          id: "1",
          customerId: "C001",
          productId: "P001",
          quantity: 1,
          unitPrice: 100,
          date: "",
          promoCode: "",
          time: "12:00",
        },
      ],
      {
        P001: {
          id: "P001",
          name: "Produit",
          category: "TEST",
          price: 100,
          weight: 1,
          taxable: true,
        },
      },
    );

    expect(result).toBe(20);
  });

  it("retourne 0 si produit non taxable", () => {
    const result = calculateTax(
      100,
      [
        {
          id: "1",
          customerId: "C001",
          productId: "P001",
          quantity: 1,
          unitPrice: 100,
          date: "",
          promoCode: "",
          time: "12:00",
        },
      ],
      {
        P001: {
          id: "P001",
          name: "Produit",
          category: "TEST",
          price: 100,
          weight: 1,
          taxable: false,
        },
      },
    );

    expect(result).toBe(0);
  });
});
