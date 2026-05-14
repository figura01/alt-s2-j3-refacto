import {
  Customer,
  Product,
  Order,
  Promotion,
  ShippingZone,
  InputData,
  CustomerReport,
  ReportResult,
} from "../types";

import { pricingConfig } from "../config/pricingConfig";

export function calculateCustomerReports(data: InputData): ReportResult {
  const { customers, products, orders, promotions, shippingZones } = data;

  const loyaltyPoints: Record<string, number> = {};

  for (const order of orders) {
    const customerId = order.customerId;

    if (!loyaltyPoints[customerId]) {
      loyaltyPoints[customerId] = 0;
    }

    loyaltyPoints[customerId] +=
      order.quantity * order.unitPrice * pricingConfig.loyaltyRatio;
  }

  const totalsByCustomer: Record<
    string,
    {
      subtotal: number;
      items: Order[];
      weight: number;
      morningBonus: number;
    }
  > = {};

  for (const order of orders) {
    const customerId = order.customerId;
    const product: Product | undefined = products[order.productId];

    const basePrice =
      product?.price !== undefined ? product.price : order.unitPrice;

    let discountRate = 0;
    let fixedDiscount = 0;

    const promoCode = order.promoCode;

    if (promoCode && promotions[promoCode]) {
      const promotion: Promotion = promotions[promoCode];

      if (promotion.active) {
        if (promotion.type === "PERCENTAGE") {
          discountRate = Number(promotion.value) / 100;
        } else if (promotion.type === "FIXED") {
          fixedDiscount = Number(promotion.value);
        }
      }
    }

    let lineTotal =
      order.quantity * basePrice * (1 - discountRate) -
      fixedDiscount * order.quantity;

    const hour = parseInt(order.time.split(":")[0], 10);

    let morningBonus = 0;

    if (hour < 10) {
      morningBonus = lineTotal * pricingConfig.morningDiscountRate;
    }

    lineTotal = lineTotal - morningBonus;

    if (!totalsByCustomer[customerId]) {
      totalsByCustomer[customerId] = {
        subtotal: 0,
        items: [],
        weight: 0,
        morningBonus: 0,
      };
    }

    totalsByCustomer[customerId].subtotal += lineTotal;
    totalsByCustomer[customerId].weight +=
      (product?.weight || 1.0) * order.quantity;
    totalsByCustomer[customerId].items.push(order);
    totalsByCustomer[customerId].morningBonus += morningBonus;
  }

  const reports: CustomerReport[] = [];

  const sortedCustomerIds = Object.keys(totalsByCustomer).sort();

  for (const customerId of sortedCustomerIds) {
    const customer: Customer | undefined = customers[customerId];

    const name = customer?.name || "Unknown";
    const level = customer?.level || "BASIC";
    const zone = customer?.shippingZone || "ZONE1";
    const currency = customer?.currency || "EUR";

    const customerTotals = totalsByCustomer[customerId];
    const subtotal = customerTotals.subtotal;

    let volumeDiscount = 0;

    if (subtotal > 50) {
      volumeDiscount = subtotal * 0.05;
    }

    if (subtotal > 100) {
      volumeDiscount = subtotal * 0.1;
    }

    if (subtotal > 500) {
      volumeDiscount = subtotal * 0.15;
    }

    if (subtotal > 1000 && level === "PREMIUM") {
      volumeDiscount = subtotal * 0.2;
    }

    const firstOrderDate = customerTotals.items[0]?.date || "";
    const dayOfWeek = firstOrderDate ? new Date(firstOrderDate).getDay() : 0;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      volumeDiscount = volumeDiscount * 1.05;
    }

    let loyaltyDiscount = 0;
    const points = loyaltyPoints[customerId] || 0;

    if (points > 100) {
      loyaltyDiscount = Math.min(points * 0.1, 50);
    }

    if (points > 500) {
      loyaltyDiscount = Math.min(points * 0.15, 100);
    }

    let totalDiscount = volumeDiscount + loyaltyDiscount;

    if (totalDiscount > pricingConfig.maxDiscount) {
      totalDiscount = pricingConfig.maxDiscount;

      const ratio =
        pricingConfig.maxDiscount / (volumeDiscount + loyaltyDiscount);

      volumeDiscount = volumeDiscount * ratio;
      loyaltyDiscount = loyaltyDiscount * ratio;
    }

    const taxable = subtotal - totalDiscount;

    let tax = 0;

    let allTaxable = true;

    for (const item of customerTotals.items) {
      const product: Product | undefined = products[item.productId];

      if (product && product.taxable === false) {
        allTaxable = false;
        break;
      }
    }

    if (allTaxable) {
      tax = Math.round(taxable * pricingConfig.taxRate * 100) / 100;
    } else {
      for (const item of customerTotals.items) {
        const product: Product | undefined = products[item.productId];

        if (product && product.taxable !== false) {
          const itemTotal = item.quantity * (product.price || item.unitPrice);

          tax += itemTotal * pricingConfig.taxRate;
        }
      }

      tax = Math.round(tax * 100) / 100;
    }

    let shipping = 0;
    const weight = customerTotals.weight;

    if (subtotal < pricingConfig.freeShippingLimit) {
      const shippingZone: ShippingZone = shippingZones[zone] || {
        zone,
        base: pricingConfig.defaultShipping,
        perKg: 0.5,
      };

      const baseShipping = shippingZone.base;

      if (weight > 10) {
        shipping = baseShipping + (weight - 10) * shippingZone.perKg;
      } else if (weight > 5) {
        shipping = baseShipping + (weight - 5) * 0.3;
      } else {
        shipping = baseShipping;
      }

      if (zone === "ZONE3" || zone === "ZONE4") {
        shipping = shipping * 1.2;
      }
    } else {
      if (weight > 20) {
        shipping = (weight - 20) * 0.25;
      }
    }

    let handling = 0;
    const itemCount = customerTotals.items.length;

    if (itemCount > 10) {
      handling = pricingConfig.handlingFee;
    }

    if (itemCount > 20) {
      handling = pricingConfig.handlingFee * 2;
    }

    let currencyRate = 1;

    if (currency === "USD") {
      currencyRate = pricingConfig.currencyRates.USD;
    } else if (currency === "GBP") {
      currencyRate = pricingConfig.currencyRates.GBP;
    }

    const total =
      Math.round((taxable + tax + shipping + handling) * currencyRate * 100) /
      100;

    reports.push({
      customerId,
      name,
      level,
      zone,
      currency,

      subtotal,
      totalDiscount,
      volumeDiscount,
      loyaltyDiscount,
      morningBonus: customerTotals.morningBonus,

      tax: tax * currencyRate,
      shipping,
      handling,
      weight,
      itemCount,

      total,
      loyaltyPoints: Math.floor(points),
    });
  }

  return {
    reports,
    json: reports,
  };
}
