import {
  InputData,
  Customer,
  Product,
  Order,
  Promotion,
  ShippingZone,
} from "../types";
import { pricingConfig } from "../config/pricingConfig";

interface CustomerReport {
  customerId: string;
  name: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  handling: number;
  total: number;
  currency: string;
  loyaltyPoints: number;
}

interface ReportResult {
  reports: CustomerReport[];
  json: CustomerReport[];
}

export function calculateCustomerReports(data: InputData): ReportResult {
  const { customers, products, orders, promotions, shippingZones } = data;

  const reports: CustomerReport[] = [];

  const ordersByCustomer: Record<string, Order[]> = {};

  for (const order of orders) {
    if (!ordersByCustomer[order.customerId]) {
      ordersByCustomer[order.customerId] = [];
    }

    ordersByCustomer[order.customerId].push(order);
  }

  for (const customerId in ordersByCustomer) {
    const customer: Customer | undefined = customers[customerId];
    const customerOrders = ordersByCustomer[customerId];

    let subtotal = 0;
    let totalWeight = 0;
    let morningBonus = 0;

    for (const order of customerOrders) {
      const product: Product | undefined = products[order.productId];

      const unitPrice = product?.price ?? order.unitPrice;
      const quantity = order.quantity;

      let lineTotal = unitPrice * quantity;

      const promotion: Promotion | undefined = order.promoCode
        ? promotions[order.promoCode]
        : undefined;

      if (promotion?.active) {
        if (promotion.type === "PERCENTAGE") {
          lineTotal *= 1 - promotion.value / 100;
        }

        if (promotion.type === "FIXED") {
          lineTotal -= promotion.value;
        }
      }

      const hour = parseInt(order.time.split(":")[0] || "12", 10);

      if (hour < 10) {
        const bonus = lineTotal * pricingConfig.morningDiscountRate;
        lineTotal -= bonus;
        morningBonus += bonus;
      }

      subtotal += Math.max(lineTotal, 0);
      totalWeight += (product?.weight ?? 1) * quantity;
    }

    let volumeDiscount = calculateVolumeDiscount(
      subtotal,
      customer?.level ?? "BASIC",
      customerOrders[0]?.date,
    );

    const loyaltyPoints = Math.floor(subtotal * pricingConfig.loyaltyRatio);

    let loyaltyDiscount = calculateLoyaltyDiscount(loyaltyPoints);

    const cappedDiscounts = capDiscounts(volumeDiscount, loyaltyDiscount);

    volumeDiscount = cappedDiscounts.volumeDiscount;
    loyaltyDiscount = cappedDiscounts.loyaltyDiscount;

    const totalDiscount = cappedDiscounts.totalDiscount;

    const taxableAmount = Math.max(subtotal - totalDiscount, 0);

    const tax = round2(taxableAmount * pricingConfig.taxRate);

    const shippingZone: ShippingZone | undefined =
      shippingZones[customer?.shippingZone ?? "ZONE1"];

    const shipping = calculateShipping(
      subtotal,
      totalWeight,
      customer?.shippingZone ?? "ZONE1",
      shippingZone,
    );

    const handling = calculateHandling(customerOrders.length);

    const currency = customer?.currency ?? "EUR";

    const currencyRate =
      pricingConfig.currencyRates[
        currency as keyof typeof pricingConfig.currencyRates
      ] ?? 1;

    const total = round2(
      (taxableAmount + tax + shipping + handling) * currencyRate,
    );

    reports.push({
      customerId,
      name: customer?.name ?? "Unknown",
      subtotal: round2(subtotal),
      discount: round2(totalDiscount),
      tax: round2(tax * currencyRate),
      shipping: round2(shipping),
      handling: round2(handling),
      total,
      currency,
      loyaltyPoints,
    });
  }

  reports.sort((a, b) => a.customerId.localeCompare(b.customerId));

  return {
    reports,
    json: reports,
  };
}

function calculateVolumeDiscount(
  subtotal: number,
  customerLevel: string,
  firstOrderDate?: string,
): number {
  let discount = 0;

  if (subtotal > 50) discount = subtotal * 0.05;
  if (subtotal > 100) discount = subtotal * 0.1;
  if (subtotal > 500) discount = subtotal * 0.15;
  if (subtotal > 1000 && customerLevel === "PREMIUM") {
    discount = subtotal * 0.2;
  }

  if (firstOrderDate) {
    const day = new Date(firstOrderDate).getDay();

    if (day === 0 || day === 6) {
      discount *= 1.05;
    }
  }

  return discount;
}

function calculateLoyaltyDiscount(points: number): number {
  if (points > 500) {
    return Math.min(points * 0.15, 100);
  }

  if (points > 100) {
    return Math.min(points * 0.1, 50);
  }

  return 0;
}

function capDiscounts(volumeDiscount: number, loyaltyDiscount: number) {
  const totalDiscount = volumeDiscount + loyaltyDiscount;

  if (totalDiscount <= pricingConfig.maxDiscount) {
    return {
      volumeDiscount,
      loyaltyDiscount,
      totalDiscount,
    };
  }

  const ratio = pricingConfig.maxDiscount / totalDiscount;

  return {
    volumeDiscount: volumeDiscount * ratio,
    loyaltyDiscount: loyaltyDiscount * ratio,
    totalDiscount: pricingConfig.maxDiscount,
  };
}

function calculateShipping(
  subtotal: number,
  weight: number,
  zone: string,
  shippingZone?: ShippingZone,
): number {
  if (subtotal >= pricingConfig.freeShippingLimit) {
    if (weight > 20) {
      return round2((weight - 20) * 0.25);
    }

    return 0;
  }

  const base = shippingZone?.base ?? pricingConfig.defaultShipping;
  const perKg = shippingZone?.perKg ?? 0.5;

  let shipping = base;

  if (weight > 10) {
    shipping = base + (weight - 10) * perKg;
  } else if (weight > 5) {
    shipping = base + (weight - 5) * 0.3;
  }

  if (zone === "ZONE3" || zone === "ZONE4") {
    shipping *= 1.2;
  }

  return round2(shipping);
}

function calculateHandling(itemCount: number): number {
  if (itemCount > 20) {
    return pricingConfig.handlingFee * 2;
  }

  if (itemCount > 10) {
    return pricingConfig.handlingFee;
  }

  return 0;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
