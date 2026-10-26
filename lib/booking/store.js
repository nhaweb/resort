import { hasDatabase } from "@/lib/db";
import { memoryStore } from "./memory-store";
import * as pgStore from "./pg-store";

/**
 * @returns {'memory' | 'postgres'}
 */
export function bookingStoreMode() {
  const forced = (process.env.BOOKING_STORE || "").toLowerCase();
  if (forced === "memory") return "memory";
  if (forced === "postgres") return "postgres";
  return hasDatabase() ? "postgres" : "memory";
}

function activeStore() {
  return bookingStoreMode() === "postgres" ? pgStore : memoryStore;
}

export async function expireStaleHolds() {
  return activeStore().expireStaleHolds();
}

export async function listActiveVillas() {
  return activeStore().listActiveVillas();
}

export async function getVilla(id) {
  return activeStore().getVilla(id);
}

export async function isVillaAvailable(
  villaId,
  checkIn,
  checkOut,
  ignoreReservationId = null,
) {
  return activeStore().isVillaAvailable(
    villaId,
    checkIn,
    checkOut,
    ignoreReservationId,
  );
}

export async function createHold(input) {
  return activeStore().createHold(input);
}

export async function getReservation(id) {
  return activeStore().getReservation(id);
}

export async function updateReservationPayment(id, patch) {
  return activeStore().updateReservationPayment(id, patch);
}

export async function recordStripeEvent(eventId, type, reservationId) {
  return activeStore().recordStripeEvent(eventId, type, reservationId);
}

export async function getReservationByCheckoutSession(sessionId) {
  return activeStore().getReservationByCheckoutSession(sessionId);
}

export async function listReservations(options) {
  return activeStore().listReservations(options);
}

export async function listInventoryBlocks() {
  return activeStore().listInventoryBlocks();
}

export async function createInventoryBlock(input) {
  return activeStore().createInventoryBlock(input);
}

export async function createEnquiry(input) {
  return activeStore().createEnquiry(input);
}

export async function listEnquiries(options) {
  return activeStore().listEnquiries(options);
}
