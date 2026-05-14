import { ReportResult } from "../types";

export function formatReport(report: ReportResult): string {
  const lines: string[] = [];

  let grandTotal = 0;
  let totalTaxCollected = 0;

  for (const customer of report.reports) {
    grandTotal += customer.total;
    totalTaxCollected += customer.tax;

    lines.push(`Customer: ${customer.name} (${customer.customerId})`);
    lines.push(
      `Level: ${customer.level} | Zone: ${customer.zone} | Currency: ${customer.currency}`,
    );
    lines.push(`Subtotal: ${customer.subtotal.toFixed(2)}`);
    lines.push(`Discount: ${customer.totalDiscount.toFixed(2)}`);
    lines.push(`  - Volume discount: ${customer.volumeDiscount.toFixed(2)}`);
    lines.push(`  - Loyalty discount: ${customer.loyaltyDiscount.toFixed(2)}`);

    if (customer.morningBonus > 0) {
      lines.push(`  - Morning bonus: ${customer.morningBonus.toFixed(2)}`);
    }

    lines.push(`Tax: ${customer.tax.toFixed(2)}`);
    lines.push(
      `Shipping (${customer.zone}, ${customer.weight.toFixed(1)}kg): ${customer.shipping.toFixed(2)}`,
    );

    if (customer.handling > 0) {
      lines.push(
        `Handling (${customer.itemCount} items): ${customer.handling.toFixed(2)}`,
      );
    }

    lines.push(`Total: ${customer.total.toFixed(2)} ${customer.currency}`);
    lines.push(`Loyalty Points: ${Math.floor(customer.loyaltyPoints)}`);
    lines.push("");
  }

  lines.push(`Grand Total: ${grandTotal.toFixed(2)} EUR`);
  lines.push(`Total Tax Collected: ${totalTaxCollected.toFixed(2)} EUR`);

  return lines.join("\n");
}
