import { query, withTransaction } from "@/lib/db";
import { HOLD_TTL_MINUTES } from "./config";

export async function expireStaleHolds() {
  await query(
    `UPDATE reservations
     SET status = 'expired', updated_at = NOW()
     WHERE status = 'held'
       AND hold_expires_at IS NOT NULL
       AND hold_expires_at < NOW()`,
  );
}

export async function listActiveVillas() {
  const { rows } = await query(
    `SELECT id, name, nightly_rate_cents, max_guests, currency, active
     FROM villas
     WHERE active = TRUE
     ORDER BY name ASC`,
  );
  return rows;
}

export async function getVilla(id) {
  const { rows } = await query(
    `SELECT id, name, nightly_rate_cents, max_guests, currency, active
     FROM villas
     WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function isVillaAvailable(
  villaId,
  checkIn,
  checkOut,
  ignoreReservationId = null,
) {
  await expireStaleHolds();

  const block = await query(
    `SELECT 1
     FROM inventory_blocks
     WHERE villa_id = $1
       AND daterange(start_date, end_date, '[)') && daterange($2::date, $3::date, '[)')
     LIMIT 1`,
    [villaId, checkIn, checkOut],
  );
  if (block.rowCount > 0) return false;

  const busy = await query(
    `SELECT 1
     FROM reservations
     WHERE villa_id = $1
       AND status IN ('held', 'paid')
       AND ($4::uuid IS NULL OR id <> $4::uuid)
       AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)')
     LIMIT 1`,
    [villaId, checkIn, checkOut, ignoreReservationId],
  );
  return busy.rowCount === 0;
}

export async function createHold(input) {
  return withTransaction(async (client) => {
    await client.query(
      `UPDATE reservations
       SET status = 'expired', updated_at = NOW()
       WHERE status = 'held'
         AND hold_expires_at IS NOT NULL
         AND hold_expires_at < NOW()`,
    );

    const available = await client.query(
      `SELECT 1
       FROM inventory_blocks
       WHERE villa_id = $1
         AND daterange(start_date, end_date, '[)') && daterange($2::date, $3::date, '[)')
       LIMIT 1`,
      [input.villaId, input.checkIn, input.checkOut],
    );
    if (available.rowCount > 0) {
      const err = new Error("Villa is not available for those dates.");
      err.code = "UNAVAILABLE";
      throw err;
    }

    const conflict = await client.query(
      `SELECT 1
       FROM reservations
       WHERE villa_id = $1
         AND status IN ('held', 'paid')
         AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)')
       LIMIT 1
       FOR UPDATE`,
      [input.villaId, input.checkIn, input.checkOut],
    );
    if (conflict.rowCount > 0) {
      const err = new Error("Villa is not available for those dates.");
      err.code = "UNAVAILABLE";
      throw err;
    }

    const { rows } = await client.query(
      `INSERT INTO reservations (
         villa_id, check_in, check_out, guests,
         guest_name, guest_email, guest_phone,
         status, amount_cents, currency, nights, hold_expires_at
       ) VALUES (
         $1, $2::date, $3::date, $4,
         $5, $6, $7,
         'held', $8, $9, $10,
         NOW() + ($11::text || ' minutes')::interval
       )
       RETURNING *`,
      [
        input.villaId,
        input.checkIn,
        input.checkOut,
        input.guests,
        input.guestName,
        input.guestEmail,
        input.guestPhone || null,
        input.amountCents,
        input.currency,
        input.nights,
        String(HOLD_TTL_MINUTES),
      ],
    );

    return serializeReservation(rows[0]);
  });
}

export async function getReservation(id) {
  await expireStaleHolds();
  const { rows } = await query(`SELECT * FROM reservations WHERE id = $1`, [
    id,
  ]);
  return rows[0] ? serializeReservation(rows[0]) : null;
}

export async function updateReservationPayment(id, patch) {
  const { rows } = await query(
    `UPDATE reservations
     SET
       stripe_checkout_session_id = COALESCE($2, stripe_checkout_session_id),
       stripe_payment_intent_id = COALESCE($3, stripe_payment_intent_id),
       status = COALESCE($4, status),
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      patch.checkoutSessionId ?? null,
      patch.paymentIntentId ?? null,
      patch.status ?? null,
    ],
  );
  return rows[0] ? serializeReservation(rows[0]) : null;
}

export async function recordStripeEvent(eventId, type, reservationId) {
  const result = await query(
    `INSERT INTO stripe_events (id, type, reservation_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [eventId, type, reservationId],
  );
  return (result.rowCount || 0) > 0;
}

export async function getReservationByCheckoutSession(sessionId) {
  await expireStaleHolds();
  const { rows } = await query(
    `SELECT * FROM reservations WHERE stripe_checkout_session_id = $1`,
    [sessionId],
  );
  return rows[0] ? serializeReservation(rows[0]) : null;
}

export async function listReservations({ limit = 100 } = {}) {
  await expireStaleHolds();
  const { rows } = await query(
    `SELECT * FROM reservations ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return rows.map(serializeReservation);
}

export async function listInventoryBlocks() {
  const { rows } = await query(
    `SELECT * FROM inventory_blocks ORDER BY start_date ASC, villa_id ASC`,
  );
  return rows.map(serializeBlock);
}

export async function createInventoryBlock({
  villaId,
  startDate,
  endDate,
  reason,
}) {
  try {
    const { rows } = await query(
      `INSERT INTO inventory_blocks (villa_id, start_date, end_date, reason)
       VALUES ($1, $2::date, $3::date, $4)
       RETURNING *`,
      [villaId, startDate, endDate, reason || null],
    );
    return serializeBlock(rows[0]);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      // 23503 = unknown villa (FK), 23514 = end_date must be after start_date
      if (error.code === "23503" || error.code === "23514") {
        const err = new Error(
          error.code === "23503"
            ? "Villa not found."
            : "End date must be after start date.",
        );
        err.code = "VALIDATION";
        throw err;
      }
    }
    throw error;
  }
}

export async function createEnquiry(input) {
  const { rows } = await query(
    `INSERT INTO enquiries (
       villa_id, guest_name, guest_email, message, check_in, check_out, locale
     ) VALUES ($1, $2, $3, $4, $5::date, $6::date, $7)
     RETURNING *`,
    [
      input.villaId || null,
      input.guestName,
      input.guestEmail,
      input.message,
      input.checkIn || null,
      input.checkOut || null,
      input.locale || null,
    ],
  );
  return serializeEnquiry(rows[0]);
}

export async function listEnquiries({ limit = 100 } = {}) {
  const { rows } = await query(
    `SELECT * FROM enquiries ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return rows.map(serializeEnquiry);
}

/** @param {Record<string, unknown>} row */
function serializeBlock(row) {
  return {
    ...row,
    start_date: toIsoDate(row.start_date),
    end_date: toIsoDate(row.end_date),
    created_at: new Date(
      /** @type {string | Date} */ (row.created_at),
    ).toISOString(),
  };
}

/** @param {Record<string, unknown>} row */
function serializeEnquiry(row) {
  return {
    ...row,
    check_in: row.check_in ? toIsoDate(row.check_in) : null,
    check_out: row.check_out ? toIsoDate(row.check_out) : null,
    created_at: new Date(
      /** @type {string | Date} */ (row.created_at),
    ).toISOString(),
  };
}

/** @param {Record<string, unknown>} row */
function serializeReservation(row) {
  return {
    ...row,
    check_in: toIsoDate(row.check_in),
    check_out: toIsoDate(row.check_out),
    hold_expires_at: row.hold_expires_at
      ? new Date(
          /** @type {string | Date} */ (row.hold_expires_at),
        ).toISOString()
      : null,
    created_at: new Date(
      /** @type {string | Date} */ (row.created_at),
    ).toISOString(),
    updated_at: new Date(
      /** @type {string | Date} */ (row.updated_at),
    ).toISOString(),
  };
}

/** @param {unknown} value */
function toIsoDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return String(value);
}
