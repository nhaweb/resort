import { connection, NextResponse } from "next/server";
import { paymentMode } from "@/lib/booking/config";
import {
  errorResponse,
  requireDatabase,
  requireString,
} from "@/lib/booking/http";
import { notifyReservationPaid } from "@/lib/booking/notify";
import {
  getReservation,
  getVilla,
  updateReservationPayment,
} from "@/lib/booking/repository";
import { createCheckoutForReservation } from "@/lib/booking/stripe";
import { isLocale } from "@/lib/i18n";

export async function POST(request, context) {
  await connection();
  try {
    requireDatabase();
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const localeRaw = typeof body.locale === "string" ? body.locale : "en";
    const locale = isLocale(localeRaw) ? localeRaw : "en";

    const reservation = await getReservation(id);
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 },
      );
    }

    if (reservation.status === "paid") {
      return NextResponse.json({
        alreadyPaid: true,
        url: null,
      });
    }

    if (reservation.status !== "held") {
      const err = new Error(
        reservation.status === "expired"
          ? "This hold has expired. Start a new booking."
          : `Reservation cannot be paid (status: ${reservation.status}).`,
      );
      err.code =
        reservation.status === "expired" ? "HOLD_EXPIRED" : "VALIDATION";
      throw err;
    }

    if (
      reservation.hold_expires_at &&
      Date.parse(reservation.hold_expires_at) < Date.now()
    ) {
      await updateReservationPayment(id, { status: "expired" });
      const err = new Error("This hold has expired. Start a new booking.");
      err.code = "HOLD_EXPIRED";
      throw err;
    }

    const villa = await getVilla(reservation.villa_id);
    if (!villa) {
      const err = new Error("Villa not found.");
      err.code = "VALIDATION";
      throw err;
    }

    requireString(reservation.guest_email, "guestEmail");

    if (paymentMode() === "stripe" && !process.env.STRIPE_SECRET_KEY) {
      const err = new Error(
        "Payments are not configured. Set STRIPE_SECRET_KEY or PAYMENT_MODE=mock.",
      );
      err.code = "VALIDATION";
      throw err;
    }

    const session = await createCheckoutForReservation({
      reservationId: reservation.id,
      villaName: villa.name,
      amountCents: reservation.amount_cents,
      currency: reservation.currency,
      guestEmail: reservation.guest_email,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      locale,
    });

    if (session.mock) {
      const paid = await updateReservationPayment(id, {
        checkoutSessionId: session.id,
        status: "paid",
      });
      await notifyReservationPaid(paid);
    } else {
      await updateReservationPayment(id, {
        checkoutSessionId: session.id,
        paymentIntentId: session.payment_intent,
      });
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      mock: Boolean(session.mock),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
