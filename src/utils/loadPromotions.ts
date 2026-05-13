import fs from "fs";
import { Promotion } from "../types";

export function loadPromotions(filePath: string) {
  // 1. Lire le contenu du fichier
  const content = fs.readFileSync(filePath, "utf-8");

  // 2. Découper les lignes et ignorer la première (en-tête)
  const lines = content.split("\n").filter(Boolean);

  // 3. Créer la map promotions
  const promotions: Record<string, Promotion> = {};

  // 4. Parser chaque ligne et remplir la map
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    // code,type,value,active

    const rawType = parts[1];
    if (rawType !== "PERCENTAGE" && rawType !== "FIXED") {
      continue;
    }

    // 5. Extraire les colonnes et construire l'objet produit
    promotions[parts[0]] = {
      code: parts[0],
      type: rawType,
      value: parseFloat(parts[2]),
      active: parts[3] === "true",
    };
  }

  return promotions;
}
