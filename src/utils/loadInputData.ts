import path from "path";
import { type InputData } from "../types/index";
import { loadCustomers } from "./loadCustomers";
import { loadProducts } from "./loadProducts";
import { loadOrders } from "./loadOrders";
import { loadShippingZones } from "./loadShippingZones";
import { loadPromotions } from "./loadPromotions";

export function loadInputData(basePath: string): InputData {
  // 1 .Définir les chemins fichiers
  const customersPath = path.join(basePath, "data", "customers.csv");
  console.log(customersPath);

  const productsPath = path.join(basePath, "data", "products.csv");
  console.log(productsPath);

  const ordersPath = path.join(basePath, "data", "orders.csv");

  const shippingZonesPath = path.join(basePath, "data", "shipping_zones.csv");

  const promotionsPath = path.join(basePath, "data", "promotions.csv");

  // 2. Charger les données CSV
  const customers = loadCustomers(customersPath);
  // console.log(customers);

  const products = loadProducts(productsPath);
  // console.log(products);

  const orders = loadOrders(ordersPath);
  // console.log(orders);

  const shippingZones = loadShippingZones(shippingZonesPath);
  // console.log(shippingZones);

  const promotions = loadPromotions(promotionsPath);
  // console.log(promotions);
  return {
    customers,
    products,
    orders,
    shippingZones,
    promotions,
  };
}
