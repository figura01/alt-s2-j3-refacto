import fs from "fs";
import { Product } from "../types";

export function loadProducts(filePath: string) {
  // 1. Lire le contenu du fichier
  const content = fs.readFileSync(filePath, "utf-8");

  // 2. Découper les lignes et ignorer la première (en-tête)
  const lines = content.split("\n").filter(Boolean);

  // 3. Créer la map produits
  const products: Record<string, Product> = {};

  // 4. Parser chaque ligne et remplir la map
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    // id,name,category,price,weight,taxable

    // 5. Extraire les colonnes et construire l'objet produit
    products[parts[0]] = {
      id: parts[0],
      name: parts[1],
      category: parts[2],
      price: parseFloat(parts[3]),
      weight: parseFloat(parts[4] || "1.0"),
      taxable: parts[5] === "true",
    };
  }

  return products;
}
