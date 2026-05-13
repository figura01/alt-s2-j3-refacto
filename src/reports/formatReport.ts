import { CustomerReport } from "../types";

// ======================================================
// FORMAT REPORT
// ======================================================

export function formatReport(report: { reports: CustomerReport[] }): string {
  // ======================================================
  // ÉTAPE 1 — Initialisation
  // ======================================================

  const lines: string[] = [];

  let grandTotal = 0;
  let totalTaxCollected = 0;

  // ======================================================
  // ÉTAPE 2 — Boucle sur les rapports clients
  // ======================================================

  for (const customer of report.reports) {
    grandTotal += customer.total;
    totalTaxCollected += customer.tax;

    // ======================================================
    // ÉTAPE 3 — Construction affichage client
    // ======================================================

    lines.push(`Customer: ${customer.name} (${customer.customerId})`);

    lines.push(`Subtotal: ${customer.subtotal.toFixed(2)}`);

    lines.push(`Discount: ${customer.discount.toFixed(2)}`);

    lines.push(`Tax: ${customer.tax.toFixed(2)}`);

    lines.push(`Shipping: ${customer.shipping.toFixed(2)}`);

    lines.push(`Handling: ${customer.handling.toFixed(2)}`);

    lines.push(`Total: ${customer.total.toFixed(2)} ${customer.currency}`);

    lines.push(`Loyalty Points: ${customer.loyaltyPoints}`);

    lines.push("");
  }

  // ======================================================
  // ÉTAPE 4 — Totaux globaux
  // ======================================================

  lines.push(`Grand Total: ${grandTotal.toFixed(2)}`);

  lines.push(`Total Tax Collected: ${totalTaxCollected.toFixed(2)}`);

  // ======================================================
  // ÉTAPE 5 — Retour texte final
  // ======================================================

  return lines.join("\n");
}
