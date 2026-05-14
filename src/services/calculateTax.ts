import { Order, Product } from "../types";
import { pricingConfig } from "../config/pricingConfig";

export function calculateTax(
  taxable: number,
  items: Order[],
  products: Record<string, Product>,
): number {
  let tax = 0;
  let allTaxable = true;

  for (const item of items) {
    const product = products[item.productId];

    if (product && product.taxable === false) {
      allTaxable = false;
      break;
    }
  }

  if (allTaxable) {
    tax = Math.round(taxable * pricingConfig.taxRate * 100) / 100;
  } else {
    for (const item of items) {
      const product = products[item.productId];

      if (product && product.taxable !== false) {
        const itemTotal = item.quantity * (product.price || item.unitPrice);

        tax += itemTotal * pricingConfig.taxRate;
      }
    }

    tax = Math.round(tax * 100) / 100;
  }

  return tax;
}
