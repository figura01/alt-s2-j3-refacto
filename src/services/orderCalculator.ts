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

import { calculateShipping } from "./calculateShipping";
import { calculateVolumeDiscount } from "./calculateVolumeDiscount";
import { calculateLoyaltyDiscount } from "./calculateLoyaltyDiscount";
import { capDiscounts } from "./capDiscounts";
import { calculateTax } from "./calculateTax";
import { calculateCurrencyRate } from "./calculateCurrencyRate";
import { calculateHandling } from "./calculateHandling";

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
          discountRate = parseFloat(promotion.value) / 100;
        } else if (promotion.type === "FIXED") {
          fixedDiscount = parseFloat(promotion.value);
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

    const firstOrderDate = customerTotals.items[0]?.date || "";

    let volumeDiscount = calculateVolumeDiscount(
      subtotal,
      level,
      firstOrderDate,
    );

    let loyaltyDiscount = calculateLoyaltyDiscount(
      loyaltyPoints[customerId] || 0,
    );

    const cappedDiscounts = capDiscounts(volumeDiscount, loyaltyDiscount);

    const totalDiscount = cappedDiscounts.totalDiscount;
    volumeDiscount = cappedDiscounts.volumeDiscount;
    loyaltyDiscount = cappedDiscounts.loyaltyDiscount;

    const taxable = subtotal - totalDiscount;

    const tax = calculateTax(taxable, customerTotals.items, products);

    const weight = customerTotals.weight;

    const shippingZone: ShippingZone = shippingZones[zone] || {
      zone,
      base: pricingConfig.defaultShipping,
      perKg: 0.5,
    };

    const shipping = calculateShipping(subtotal, weight, zone, shippingZone);

    const itemCount = customerTotals.items.length;

    const handling = calculateHandling(itemCount);

    const currencyRate = calculateCurrencyRate(currency);

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
      loyaltyPoints: Math.floor(loyaltyPoints[customerId] || 0),
    });
  }

  return {
    reports,
    json: reports,
  };
}
