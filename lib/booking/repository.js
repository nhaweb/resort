/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   nightly_rate_cents: number,
 *   max_guests: number,
 *   currency: string,
 *   active: boolean
 * }} VillaRow
 */

/**
 * @typedef {{
 *   id: string,
 *   villa_id: string,
 *   check_in: string,
 *   check_out: string,
 *   guests: number,
 *   guest_name: string,
 *   guest_email: string,
 *   guest_phone: string | null,
 *   status: string,
 *   amount_cents: number,
 *   currency: string,
 *   nights: number,
 *   hold_expires_at: string | null,
 *   stripe_checkout_session_id: string | null,
 *   stripe_payment_intent_id: string | null,
 *   created_at: string,
 *   updated_at: string
 * }} ReservationRow
 */

/**
 * @typedef {{
 *   id: string,
 *   villa_id: string,
 *   start_date: string,
 *   end_date: string,
 *   reason: string | null,
 *   created_at: string
 * }} InventoryBlockRow
 */

/**
 * @typedef {{
 *   id: string,
 *   villa_id: string | null,
 *   guest_name: string,
 *   guest_email: string,
 *   message: string,
 *   check_in: string | null,
 *   check_out: string | null,
 *   locale: string | null,
 *   created_at: string
 * }} EnquiryRow
 */

export {
  createEnquiry,
  createHold,
  createInventoryBlock,
  expireStaleHolds,
  getReservation,
  getReservationByCheckoutSession,
  getVilla,
  isVillaAvailable,
  listActiveVillas,
  listEnquiries,
  listInventoryBlocks,
  listReservations,
  recordStripeEvent,
  updateReservationPayment,
} from "./store";
