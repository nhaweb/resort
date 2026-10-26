import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { MIN_STAY_NIGHTS } from "./config";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isIsoDate(value) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/**
 * @param {string} checkIn
 * @param {string} checkOut
 * @returns {number}
 */
export function nightsBetween(checkIn, checkOut) {
  const start = Date.parse(`${checkIn}T00:00:00.000Z`);
  const end = Date.parse(`${checkOut}T00:00:00.000Z`);
  return Math.round((end - start) / 86_400_000);
}

/**
 * @param {string | null | undefined} locale
 * @returns {import('@/lib/i18n').Locale}
 */
function stayLocale(locale) {
  return locale && isLocale(locale) ? locale : defaultLocale;
}

/**
 * @param {string} checkIn
 * @param {string} checkOut
 * @param {string} [locale]
 * @returns {{ ok: true, nights: number } | { ok: false, error: string }}
 */
export function validateStay(checkIn, checkOut, locale) {
  const errors = getDictionary(stayLocale(locale)).booking.errors;

  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) {
    return { ok: false, error: errors.invalidDates };
  }

  const today = new Date();
  const todayIso = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  )
    .toISOString()
    .slice(0, 10);

  if (checkIn < todayIso) {
    return { ok: false, error: errors.pastCheckIn };
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < MIN_STAY_NIGHTS) {
    return {
      ok: false,
      error: errors.minStay.replace("{n}", String(MIN_STAY_NIGHTS)),
    };
  }

  return { ok: true, nights };
}
