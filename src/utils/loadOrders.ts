import fs from "fs";
import { Order } from "../types";

export function loadOrders(filePath: string): Order[] {
  // 1. Lire le contenu du fichier
  const content = fs.readFileSync(filePath, "utf-8");

  // 2. Découper les lignes et ignorer la première (en-tête)
  const lines = content.split("\n").filter(Boolean);

  // 3. Créer la map commandes
  const orders: Order[] = [];

  // 4. Parser chaque ligne et remplir la map
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    // id,customer_id,product_id,qty,unit_price,date,promo_code,time

    // 5. Extraire les colonnes et construire l'objet order
    orders.push({
      id: parts[0],
      customerId: parts[1],
      productId: parts[2],
      quantity: parseInt(parts[3]),
      unitPrice: parseFloat(parts[4]),
      date: parts[5],
      promoCode: parts[6],
      time: parts[7],
    });
  }

  return orders;
}
