import fs from "fs";

export function loadCustomers(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");

  const lines = content.split("\n").filter(Boolean);

  const customers: Record<string, any> = {};

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");

    customers[parts[0]] = {
      id: parts[0],
      name: parts[1],
      level: parts[2],
      shippingZone: parts[3],
      currency: parts[4] || "EUR",
    };
  }

  return customers;
}
