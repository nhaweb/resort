import { listActiveVillas } from "@/lib/booking/repository";

/**
 * Server-only. Reads current rates straight from the booking store.
 * Returns an empty list when the store is unavailable so room pages still
 * render from the dictionary catalog.
 * @returns {Promise<import('./rooms').InventoryVilla[]>}
 */
export async function loadInventoryVillas() {
  try {
    const villas = await listActiveVillas();
    return villas.map((v) => ({
      id: v.id,
      name: v.name,
      nightlyRateCents: v.nightly_rate_cents,
      maxGuests: v.max_guests,
      currency: v.currency,
    }));
  } catch (error) {
    console.error("[rooms] inventory unavailable", error);
    return [];
  }
}
