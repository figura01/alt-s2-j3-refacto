export type CustomerLevel = "BASIC" | "PREMIUM";
export type Currency = "EUR" | "USD" | "GBP";
export type PromotionType = "PERCENTAGE" | "FIXED";

export interface Customer {
  id: string;
  name: string;
  level: CustomerLevel;
  shippingZone: string;
  currency: Currency;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: number;
  taxable: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  date: string;
  promoCode?: string;
  time: string;
}

export interface ShippingZone {
  zone: string;
  base: number;
  perKg: number;
}

export interface Promotion {
  code: string;
  type: PromotionType;
  value: number;
  active: boolean;
}

export interface InputData {
  customers: any;
  products: any;
  orders: any;
  shippingZones: any;
  promotions: any;
}

export interface CurrencyRates {
  EUR: number;
  USD: number;
  GBP: number;
}

export interface CustomerReport {
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

export interface ReportResult {
  reports: CustomerReport[];
  json: CustomerReport[];
}

export interface PricingConfig {
  taxRate: number;
  freeShippingLimit: number;
  defaultShipping: number;
  loyaltyRatio: number;
  handlingFee: number;
  maxDiscount: number;
  morningDiscountRate: number;

  currencyRates: CurrencyRates;
}
