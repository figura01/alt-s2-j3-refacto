import { ShippingZone } from "../types";
import { pricingConfig } from "../config/pricingConfig";

export function calculateShipping(
  subtotal: number,
  weight: number,
  zone: string,
  shippingZone?: ShippingZone,
): number {
  let ship = 0;

  if (subtotal < pricingConfig.freeShippingLimit) {
    const currentZone = shippingZone || {
      zone,
      base: 5.0,
      perKg: 0.5,
    };

    const baseShip = currentZone.base;

    if (weight > 10) {
      ship = baseShip + (weight - 10) * currentZone.perKg;
    } else if (weight > 5) {
      ship = baseShip + (weight - 5) * 0.3;
    } else {
      ship = baseShip;
    }

    if (zone === "ZONE3" || zone === "ZONE4") {
      ship = ship * 1.2;
    }
  } else {
    if (weight > 20) {
      ship = (weight - 20) * 0.25;
    }
  }

  return ship;
}
