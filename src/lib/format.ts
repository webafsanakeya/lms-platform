// Prices are stored as integer cents in the database.
export function formatPrice(priceCents: number) {
  if (priceCents <= 0) return "Free";
  return `$${(priceCents / 100).toFixed(2)}`;
}