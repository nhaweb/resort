/**
 * @param {number} amountCents
 * @param {string} currency
 */
export function formatMoney(amountCents, currency) {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: String(currency || "eur").toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${String(currency).toUpperCase()}`;
  }
}
