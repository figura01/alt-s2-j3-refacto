import fs from "fs";
import { ShippingZone } from "../types";

export function loadShippingZones(filePath: string) {
  // 1. Lire le contenu du fichier
  const content = fs.readFileSync(filePath, "utf-8");

  // 2. Découper les lignes et ignorer la première (en-tête)
  const lines = content.split("\n").filter(Boolean);

  // 3. Créer la map zones de livraison
  const shippingZones: Record<string, ShippingZone> = {};

  // 4. Parser chaque ligne et remplir la map
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    // zone,base,per_kg

    // 5. Extraire les colonnes et construire l'objet zone de livraison
    shippingZones[parts[0]] = {
      zone: parts[0],
      base: parseFloat(parts[1]),
      perKg: parseFloat(parts[2]),
    };
  }

  return shippingZones;
}
