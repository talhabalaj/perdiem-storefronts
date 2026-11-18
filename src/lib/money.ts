/** Prices are stored as integer minor units (cents/pence) and only formatted at the edge. */
export function formatMoney(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
