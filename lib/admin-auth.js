import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "orilla_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

/** @returns {string} */
function adminSecret() {
  return process.env.ADMIN_SECRET || "";
}

/** @param {string} value */
function digest(value) {
  return createHash("sha256").update(value).digest();
}

/**
 * Constant-time string comparison.
 *
 * @param {string} a
 * @param {string} b
 */
function safeEqual(a, b) {
  return timingSafeEqual(digest(a), digest(b));
}

/**
 * Cookie value derived from the secret so the raw secret never sits in the browser.
 * Rotating ADMIN_SECRET invalidates existing sessions.
 */
export function adminSessionToken() {
  return createHash("sha256")
    .update(`orilla-admin-session:${adminSecret()}`)
    .digest("hex");
}

/** @param {string} candidate */
export function isValidAdminSecret(candidate) {
  const secret = adminSecret();
  return Boolean(secret) && safeEqual(candidate, secret);
}

/**
 * @param {string} code
 * @param {string} message
 */
function authError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

/** Throws ADMIN_DISABLED (503) when ADMIN_SECRET is unset. */
export function requireAdminConfigured() {
  if (!adminSecret()) {
    throw authError(
      "ADMIN_DISABLED",
      "Admin is disabled. Set ADMIN_SECRET to enable it.",
    );
  }
}

/**
 * Accepts `x-admin-secret`, `Authorization: Bearer <secret>`, or the
 * `orilla_admin` session cookie set by `POST /api/admin/login`.
 * Throws ADMIN_DISABLED (503) or UNAUTHORIZED (401).
 *
 * @param {Request} request
 */
export function assertAdmin(request) {
  requireAdminConfigured();

  const header = request.headers.get("x-admin-secret");
  if (header && isValidAdminSecret(header)) return;

  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";
  if (bearer && isValidAdminSecret(bearer)) return;

  const cookies = request.headers.get("cookie") || "";
  const match = cookies
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`));
  const session = match ? match.slice(ADMIN_COOKIE.length + 1) : "";
  if (session && safeEqual(session, adminSessionToken())) return;

  throw authError("UNAUTHORIZED", "Admin authentication required.");
}
