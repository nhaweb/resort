import { randomUUID } from "node:crypto";
import { HOLD_TTL_MINUTES } from "./config";

/** @type {Map<string, import('./repository').VillaRow>} */
const villas = new Map([
  ["east-cut", villa("east-cut", "East Cut", 48000, 2)],
  ["shelf", villa("shelf", "The Shelf", 52000, 2)],
  ["high-ledge", villa("high-ledge", "High Ledge", 45000, 2)],
  ["low-path", villa("low-path", "Low Path", 49000, 2)],
  ["dining-house", villa("dining-house", "Dining House", 60000, 4)],
  ["bath-house", villa("bath-house", "Bath House", 42000, 2)],
  ["north-cut", villa("north-cut", "North Cut", 44000, 2)],
  ["mid-terrace", villa("mid-terrace", "Mid Terrace", 47000, 3)],
  ["last-light", villa("last-light", "Last Light", 51000, 2)],
]);

/** @type {Map<string, import('./repository').ReservationRow>} */
const reservations = new Map();
/** @type {Set<string>} */
const stripeEvents = new Set();
/** @type {import('./repository').InventoryBlockRow[]} */
const blocks = [];
/** @type {import('./repository').EnquiryRow[]} */
const enquiries = [];

function villa(id, name, nightly_rate_cents, max_guests) {
  return {
    id,
    name,
    nightly_rate_cents,
    max_guests,
    currency: "eur",
    active: true,
  };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function expireStaleHolds() {
  const now = Date.now();
  for (const row of reservations.values()) {
    if (
      row.status === "held" &&
      row.hold_expires_at &&
      Date.parse(row.hold_expires_at) < now
    ) {
      row.status = "expired";
      row.updated_at = new Date().toISOString();
    }
  }
}

export const memoryStore = {
  async expireStaleHolds() {
    expireStaleHolds();
  },

  async listActiveVillas() {
    return [...villas.values()]
      .filter((v) => v.active)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getVilla(id) {
    return villas.get(id) || null;
  },

  async isVillaAvailable(
    villaId,
    checkIn,
    checkOut,
    ignoreReservationId = null,
  ) {
    expireStaleHolds();
    if (
      blocks.some(
        (b) =>
          b.villa_id === villaId &&
          rangesOverlap(b.start_date, b.end_date, checkIn, checkOut),
      )
    ) {
      return false;
    }
    for (const row of reservations.values()) {
      if (ignoreReservationId && row.id === ignoreReservationId) continue;
      if (row.villa_id !== villaId) continue;
      if (row.status !== "held" && row.status !== "paid") continue;
      if (rangesOverlap(row.check_in, row.check_out, checkIn, checkOut)) {
        return false;
      }
    }
    return true;
  },

  async createHold(input) {
    expireStaleHolds();
    const ok = await memoryStore.isVillaAvailable(
      input.villaId,
      input.checkIn,
      input.checkOut,
    );
    if (!ok) {
      const err = new Error("Villa is not available for those dates.");
      err.code = "UNAVAILABLE";
      throw err;
    }

    const now = new Date();
    const holdExpires = new Date(
      now.getTime() + HOLD_TTL_MINUTES * 60_000,
    ).toISOString();
    /** @type {import('./repository').ReservationRow} */
    const row = {
      id: randomUUID(),
      villa_id: input.villaId,
      check_in: input.checkIn,
      check_out: input.checkOut,
      guests: input.guests,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      guest_phone: input.guestPhone || null,
      status: "held",
      amount_cents: input.amountCents,
      currency: input.currency,
      nights: input.nights,
      hold_expires_at: holdExpires,
      stripe_checkout_session_id: null,
      stripe_payment_intent_id: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    reservations.set(row.id, row);
    return { ...row };
  },

  async getReservation(id) {
    expireStaleHolds();
    const row = reservations.get(id);
    return row ? { ...row } : null;
  },

  async updateReservationPayment(id, patch) {
    const row = reservations.get(id);
    if (!row) return null;
    if (patch.checkoutSessionId != null) {
      row.stripe_checkout_session_id = patch.checkoutSessionId;
    }
    if (patch.paymentIntentId != null) {
      row.stripe_payment_intent_id = patch.paymentIntentId;
    }
    if (patch.status != null) row.status = patch.status;
    row.updated_at = new Date().toISOString();
    return { ...row };
  },

  async recordStripeEvent(eventId, _type, _reservationId) {
    if (stripeEvents.has(eventId)) return false;
    stripeEvents.add(eventId);
    return true;
  },

  async getReservationByCheckoutSession(sessionId) {
    expireStaleHolds();
    for (const row of reservations.values()) {
      if (row.stripe_checkout_session_id === sessionId) return { ...row };
    }
    return null;
  },

  async listReservations({ limit = 100 } = {}) {
    expireStaleHolds();
    return [...reservations.values()]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((row) => ({ ...row }));
  },

  async listInventoryBlocks() {
    return [...blocks]
      .sort(
        (a, b) =>
          a.start_date.localeCompare(b.start_date) ||
          a.villa_id.localeCompare(b.villa_id),
      )
      .map((row) => ({ ...row }));
  },

  async createInventoryBlock({ villaId, startDate, endDate, reason }) {
    if (!villas.has(villaId)) {
      const err = new Error("Villa not found.");
      err.code = "VALIDATION";
      throw err;
    }
    /** @type {import('./repository').InventoryBlockRow} */
    const row = {
      id: randomUUID(),
      villa_id: villaId,
      start_date: startDate,
      end_date: endDate,
      reason: reason || null,
      created_at: new Date().toISOString(),
    };
    blocks.push(row);
    return { ...row };
  },

  async createEnquiry(input) {
    /** @type {import('./repository').EnquiryRow} */
    const row = {
      id: randomUUID(),
      villa_id: input.villaId || null,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      message: input.message,
      check_in: input.checkIn || null,
      check_out: input.checkOut || null,
      locale: input.locale || null,
      created_at: new Date().toISOString(),
    };
    enquiries.push(row);
    return { ...row };
  },

  async listEnquiries({ limit = 100 } = {}) {
    return [...enquiries]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((row) => ({ ...row }));
  },
};
