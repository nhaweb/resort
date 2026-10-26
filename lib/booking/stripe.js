import Stripe from "stripe";
import { appBaseUrl, paymentMode } from "./config";

/** @type {import('stripe').Stripe | null} */
let stripeClient = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2026-09-30.endive",
    });
  }
  return stripeClient;
}

/**
 * @param {{
 *   reservationId: string,
 *   villaName: string,
 *   amountCents: number,
 *   currency: string,
 *   guestEmail: string,
 *   checkIn: string,
 *   checkOut: string,
 *   locale: string
 * }} input
 */
export async function createCheckoutForReservation(input) {
  if (paymentMode() === "mock") {
    const mockSessionId = `mock_cs_${input.reservationId}`;
    return {
      id: mockSessionId,
      url: `${appBaseUrl()}/${input.locale}/book/success?reservation=${input.reservationId}&mock=1`,
      payment_intent: null,
      mock: true,
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.guestEmail,
    client_reference_id: input.reservationId,
    metadata: {
      reservation_id: input.reservationId,
      villa_name: input.villaName,
      check_in: input.checkIn,
      check_out: input.checkOut,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency,
          unit_amount: input.amountCents,
          product_data: {
            name: `Orilla · ${input.villaName}`,
            description: `${input.checkIn} → ${input.checkOut}`,
          },
        },
      },
    ],
    success_url: `${appBaseUrl()}/${input.locale}/book/success?reservation=${input.reservationId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appBaseUrl()}/${input.locale}/book?reservation=${input.reservationId}&cancelled=1`,
  });

  return {
    id: session.id,
    url: session.url,
    payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null,
    mock: false,
  };
}

/**
 * @param {string} rawBody
 * @param {string | null} signature
 */
export function constructStripeEvent(rawBody, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }
  if (!signature) {
    throw new Error("Missing Stripe-Signature header");
  }
  return getStripe().webhooks.constructEvent(rawBody, signature, secret);
}
