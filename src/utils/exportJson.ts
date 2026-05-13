import fs from "fs";
import path from "path";

import { CustomerReport } from "../types";

export function exportJson(basePath: string, data: CustomerReport[]): void {
  // 1 — Transformer le format

  const formattedData = data.map((report: CustomerReport) => ({
    customer_id: report.customerId,

    name: report.name,

    total: report.total,

    currency: report.currency,

    loyalty_points: report.loyaltyPoints,
  }));

  // 2 — Créer chemin fichier
  const outputPath = path.join(basePath, "output.json");

  // 3 — Conversion JSON
  const json = JSON.stringify(formattedData, null, 2);

  // 4 — Écriture fichier
  fs.writeFileSync(outputPath, json, "utf-8");

  // 5   — Log console
  console.log(`OK JSON exporté : ${outputPath}`);
}
