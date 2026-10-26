import { connection, NextResponse } from "next/server";
import { paymentMode } from "@/lib/booking/config";
import { requireDatabase } from "@/lib/booking/http";
import { notifyReservationPaid } from "@/lib/booking/notify";
import {
  getReservation,
  getReservationByCheckoutSession,
  recordStripeEvent,
  updateReservationPayment,
} from "@/lib/booking/repository";
import { constructStripeEvent } from "@/lib/booking/stripe";

export async function POST(request) {
  await connection();
  try {
    requireDatabase();

    if (paymentMode() === "mock") {
      return NextResponse.json({ received: true, mock: true });
    }

    const signature = request.headers.get("stripe-signature");
    const rawBody = await request.text();
    const event = constructStripeEvent(rawBody, signature);

    const reservationIdFromMeta =
      event.data?.object &&
      typeof event.data.object === "object" &&
      "metadata" in event.data.object &&
      event.data.object.metadata &&
      typeof event.data.object.metadata.reservation_id === "string"
        ? event.data.object.metadata.reservation_id
        : null;

    const isNew = await recordStripeEvent(
      event.id,
      event.type,
      reservationIdFromMeta,
    );
    if (!isNew) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId =
        session.metadata?.reservation_id || session.client_reference_id || null;

      let reservation = reservationId
        ? await getReservation(reservationId)
        : null;
      if (!reservation && session.id) {
        reservation = await getReservationByCheckoutSession(session.id);
      }

      if (reservation && reservation.status !== "paid") {
        const paymentIntent =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null;

        const paid = await updateReservationPayment(reservation.id, {
          checkoutSessionId: session.id,
          paymentIntentId: paymentIntent,
          status: "paid",
        });
        await notifyReservationPaid(paid);
      }
    }

    if (
      event.type === "checkout.session.expired" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const obj = event.data.object;
      const reservationId =
        obj.metadata?.reservation_id || obj.client_reference_id || null;
      let reservation = reservationId
        ? await getReservation(reservationId)
        : null;
      if (!reservation && obj.object === "checkout.session" && obj.id) {
        reservation = await getReservationByCheckoutSession(obj.id);
      }
      if (reservation && reservation.status === "held") {
        await updateReservationPayment(reservation.id, { status: "failed" });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe-webhook]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 400 },
    );
  }
}
