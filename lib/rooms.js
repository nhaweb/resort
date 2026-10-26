import { getDictionary } from "@/lib/dictionaries";

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   line: string,
 *   materials: string,
 *   aspect: string,
 *   image: string,
 *   alt: string,
 *   description: string,
 *   amenities: string[],
 *   images: { src: string, alt: string }[]
 * }} MarketingVilla
 */

/**
 * Transactional fields owned by the booking store (/api/villas shape).
 * @typedef {{
 *   id: string,
 *   name?: string,
 *   nightlyRateCents: number,
 *   maxGuests: number,
 *   currency: string
 * }} InventoryVilla
 */

/**
 * @typedef {MarketingVilla & {
 *   nightlyRateCents: number | null,
 *   maxGuests: number | null,
 *   currency: string | null
 * }} RoomEntry
 */

/**
 * Marketing catalog (copy + imagery) for a locale.
 * @param {import('@/lib/i18n').Locale} locale
 * @returns {MarketingVilla[]}
 */
export function getRoomCatalog(locale) {
  return getDictionary(locale).villas;
}

/**
 * @param {import('@/lib/i18n').Locale} locale
 * @param {string} id
 * @returns {MarketingVilla | undefined}
 */
export function findRoom(locale, id) {
  return getRoomCatalog(locale).find((villa) => villa.id === id);
}

/** Villa ids, identical across locales — used for static params. */
export function getRoomIds() {
  return getRoomCatalog("en").map((villa) => villa.id);
}

/**
 * Join dictionary copy with inventory rates. Rates and guest caps stay
 * transactional: they are null when inventory is missing or unreachable.
 * @param {MarketingVilla} marketingVilla
 * @param {InventoryVilla | null | undefined} [inventoryVilla]
 * @returns {RoomEntry}
 */
export function mergeRoomWithInventory(marketingVilla, inventoryVilla) {
  return {
    ...marketingVilla,
    nightlyRateCents: inventoryVilla?.nightlyRateCents ?? null,
    maxGuests: inventoryVilla?.maxGuests ?? null,
    currency: inventoryVilla?.currency ?? null,
  };
}

/**
 * @param {number} cents
 * @param {string | null | undefined} currency
 * @param {import('@/lib/i18n').Locale} locale
 */
export function formatRoomMoney(cents, currency, locale) {
  const code = (currency || "eur").toUpperCase();
  try {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-GB", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `${Math.round(cents / 100)} ${code}`;
  }
}
