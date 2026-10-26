import { connection, NextResponse } from "next/server";
import { validateStay } from "@/lib/booking/dates";
import {
  errorResponse,
  requireDatabase,
  requireEmail,
  requirePositiveInt,
  requireString,
} from "@/lib/booking/http";
import { createHold, getVilla } from "@/lib/booking/repository";
import { isLocale } from "@/lib/i18n";

export async function POST(request) {
  await connection();
  try {
    requireDatabase();
    const body = await request.json();

    const villaId = requireString(body.villaId, "villaId");
    const checkIn = requireString(body.checkIn, "checkIn");
    const checkOut = requireString(body.checkOut, "checkOut");
    const guests = requirePositiveInt(body.guests, "guests");
    const guestName = requireString(body.guestName, "guestName");
    const guestEmail = requireEmail(body.guestEmail, "guestEmail");
    const guestPhone =
      typeof body.guestPhone === "string" ? body.guestPhone.trim() : null;
    const locale = isLocale(body.locale) ? body.locale : undefined;

    const stay = validateStay(checkIn, checkOut, locale);
    if (!stay.ok) {
      const err = new Error(stay.error);
      err.code = "VALIDATION";
      throw err;
    }

    const villa = await getVilla(villaId);
    if (!villa || !villa.active) {
      const err = new Error("Villa not found.");
      err.code = "VALIDATION";
      throw err;
    }
    if (guests > villa.max_guests) {
      const err = new Error(
        `This villa allows up to ${villa.max_guests} guests.`,
      );
      err.code = "VALIDATION";
      throw err;
    }

    const reservation = await createHold({
      villaId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      amountCents: villa.nightly_rate_cents * stay.nights,
      currency: villa.currency,
      nights: stay.nights,
    });

    return NextResponse.json(
      {
        reservation: publicReservation(reservation),
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23P01"
    ) {
      const err = new Error("Villa is not available for those dates.");
      err.code = "UNAVAILABLE";
      return errorResponse(err);
    }
    return errorResponse(error);
  }
}

/** @param {import('@/lib/booking/repository').ReservationRow} row */
function publicReservation(row) {
  return {
    id: row.id,
    villaId: row.villa_id,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone,
    status: row.status,
    amountCents: row.amount_cents,
    currency: row.currency,
    nights: row.nights,
    holdExpiresAt: row.hold_expires_at,
  };
}
