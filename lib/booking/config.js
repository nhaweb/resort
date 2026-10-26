export const HOLD_TTL_MINUTES = Number(
  process.env.BOOKING_HOLD_TTL_MINUTES || 15,
);
export const MIN_STAY_NIGHTS = Number(process.env.BOOKING_MIN_STAY_NIGHTS || 2);
export const DEFAULT_CURRENCY = "eur";

/** @returns {'stripe' | 'mock'} */
export function paymentMode() {
  const mode = (process.env.PAYMENT_MODE || "stripe").toLowerCase();
  return mode === "mock" ? "mock" : "stripe";
}

export function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
