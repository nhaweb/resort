import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { bookingStoreMode } from "./store";

/**
 * @param {unknown} error
 * @param {number} [fallbackStatus]
 */
export function errorResponse(error, fallbackStatus = 500) {
  const message =
    error instanceof Error ? error.message : "Unexpected server error";
  const code =
    error && typeof error === "object" && "code" in error
      ? /** @type {{ code?: string }} */ (error).code
      : undefined;

  if (code === "UNAVAILABLE") {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  if (code === "HOLD_EXPIRED") {
    return NextResponse.json({ error: message }, { status: 410 });
  }
  if (code === "VALIDATION") {
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (code === "UNAUTHORIZED") {
    return NextResponse.json({ error: message }, { status: 401 });
  }
  if (code === "ADMIN_DISABLED") {
    return NextResponse.json({ error: message }, { status: 503 });
  }

  console.error("[booking]", error);
  return NextResponse.json({ error: message }, { status: fallbackStatus });
}

/** Ensures a booking store is available (Postgres or in-memory). */
export function requireDatabase() {
  const mode = bookingStoreMode();
  if (mode === "postgres" && !hasDatabase()) {
    const err = new Error(
      "DATABASE_URL is required when BOOKING_STORE=postgres.",
    );
    err.code = "VALIDATION";
    throw err;
  }
}

/**
 * @param {unknown} value
 * @param {string} field
 */
export function requireString(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    const err = new Error(`${field} is required.`);
    err.code = "VALIDATION";
    throw err;
  }
  return value.trim();
}

/**
 * @param {unknown} value
 * @param {string} field
 */
export function requireEmail(value, field) {
  const email = requireString(value, field);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const err = new Error(`${field} must be a valid email.`);
    err.code = "VALIDATION";
    throw err;
  }
  return email.toLowerCase();
}

/**
 * @param {unknown} value
 * @param {string} field
 */
export function requirePositiveInt(value, field) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 1) {
    const err = new Error(`${field} must be a positive integer.`);
    err.code = "VALIDATION";
    throw err;
  }
  return n;
}
