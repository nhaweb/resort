import { connection, NextResponse } from "next/server";
import { errorResponse, requireDatabase } from "@/lib/booking/http";
import { getReservation, getVilla } from "@/lib/booking/repository";

export async function GET(_request, context) {
  await connection();
  try {
    requireDatabase();
    const { id } = await context.params;
    const reservation = await getReservation(id);
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 },
      );
    }

    const villa = await getVilla(reservation.villa_id);

    return NextResponse.json({
      reservation: {
        id: reservation.id,
        villaId: reservation.villa_id,
        villaName: villa?.name || reservation.villa_id,
        checkIn: reservation.check_in,
        checkOut: reservation.check_out,
        guests: reservation.guests,
        guestName: reservation.guest_name,
        guestEmail: reservation.guest_email,
        guestPhone: reservation.guest_phone,
        status: reservation.status,
        amountCents: reservation.amount_cents,
        currency: reservation.currency,
        nights: reservation.nights,
        holdExpiresAt: reservation.hold_expires_at,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
