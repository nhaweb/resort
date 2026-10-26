/**
 * Fetch helper for admin pages. Sends the httpOnly session cookie and throws
 * an Error with `.status` on non-2xx responses.
 *
 * @param {string} path
 * @param {RequestInit} [init]
 */
export async function adminFetch(path, init = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers: { "content-type": "application/json", ...init.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.error || `Request failed (${response.status})`,
    );
    /** @type {Error & { status?: number }} */ (error).status = response.status;
    throw error;
  }
  return data;
}

/** @param {unknown} error */
export function isUnauthorized(error) {
  return (
    error instanceof Error &&
    /** @type {{ status?: number }} */ (error).status === 401
  );
}
