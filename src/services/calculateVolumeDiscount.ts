export function calculateVolumeDiscount(
  subtotal: number,
  level: string,
  firstOrderDate: string,
): number {
  let discount = 0;

  if (subtotal > 50) {
    discount = subtotal * 0.05;
  }

  if (subtotal > 100) {
    discount = subtotal * 0.1;
  }

  if (subtotal > 500) {
    discount = subtotal * 0.15;
  }

  if (subtotal > 1000 && level === "PREMIUM") {
    discount = subtotal * 0.2;
  }

  const dayOfWeek = firstOrderDate ? new Date(firstOrderDate).getDay() : 0;

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    discount = discount * 1.05;
  }

  return discount;
}
