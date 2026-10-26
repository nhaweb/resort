/**
 * Transactional email. `EMAIL_MODE=mock` (default) logs to the console;
 * `EMAIL_MODE=resend` sends through Resend (requires RESEND_API_KEY + EMAIL_FROM).
 */

/** @typedef {{ ok: boolean, mock?: boolean, id?: string, error?: string }} EmailResult */

import { formatMoney } from "@/lib/format";

const DEFAULT_FROM = "Orilla <onboarding@resend.dev>";

/** @returns {'mock' | 'resend'} */
export function emailMode() {
  const mode = (process.env.EMAIL_MODE || "mock").toLowerCase();
  return mode === "resend" ? "resend" : "mock";
}

/** @param {string} value */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Sends an email. Never throws; failures resolve to `{ ok: false }`.
 *
 * @param {{ to: string, subject: string, text: string, html?: string, replyTo?: string }} message
 * @returns {Promise<EmailResult>}
 */
export async function sendEmail(message) {
  if (emailMode() === "mock") {
    console.log(
      `[email:mock] to=${message.to} subject="${message.subject}"\n${message.text}`,
    );
    return { ok: true, mock: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] EMAIL_MODE=resend but RESEND_API_KEY is not set.");
    return { ok: false, error: "RESEND_API_KEY is not set." };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const replyTo = message.replyTo || process.env.EMAIL_REPLY_TO || undefined;
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo,
    });
    if (error) {
      console.error("[email] Resend rejected message:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (error) {
    console.error("[email] Failed to send:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email failed",
    };
  }
}

/**
 * Booking confirmation sent once a reservation is `paid`.
 *
 * @param {import('@/lib/booking/repository').ReservationRow} reservation
 * @param {{ name: string } | null} villa
 * @returns {Promise<EmailResult>}
 */
export async function sendBookingConfirmation(reservation, villa) {
  const villaName = villa?.name || reservation.villa_id;
  const amount = formatMoney(reservation.amount_cents, reservation.currency);
  const nights = `${reservation.nights} night${reservation.nights === 1 ? "" : "s"}`;
  const guests = `${reservation.guests} guest${reservation.guests === 1 ? "" : "s"}`;

  const lines = [
    `Hello ${reservation.guest_name},`,
    "",
    "Your stay at Orilla is confirmed. Thank you for booking with us.",
    "",
    `Villa: ${villaName}`,
    `Check-in: ${reservation.check_in}`,
    `Check-out: ${reservation.check_out} (${nights})`,
    `Guests: ${guests}`,
    `Total paid: ${amount}`,
    `Reference: ${reservation.id}`,
    "",
    "Keep this reference for any question about your stay. Reply to this email and we will help.",
    "",
    "Orilla",
  ];

  const rows = [
    ["Villa", villaName],
    ["Check-in", reservation.check_in],
    ["Check-out", `${reservation.check_out} (${nights})`],
    ["Guests", guests],
    ["Total paid", amount],
    ["Reference", reservation.id],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666">${escapeHtml(label)}</td><td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">
<p>Hello ${escapeHtml(reservation.guest_name)},</p>
<p>Your stay at Orilla is confirmed. Thank you for booking with us.</p>
<table style="border-collapse:collapse">${rows}</table>
<p>Keep this reference for any question about your stay. Reply to this email and we will help.</p>
<p>Orilla</p>
</div>`;

  return sendEmail({
    to: reservation.guest_email,
    subject: `Your Orilla stay is confirmed: ${villaName}, ${reservation.check_in}`,
    text: lines.join("\n"),
    html,
  });
}

/**
 * Internal notification for a new sold-out enquiry. No-op without a recipient.
 *
 * @param {import('@/lib/booking/repository').EnquiryRow} enquiry
 * @returns {Promise<EmailResult | null>}
 */
export async function sendEnquiryNotification(enquiry) {
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!to) return null;

  const dates =
    enquiry.check_in && enquiry.check_out
      ? `${enquiry.check_in} to ${enquiry.check_out}`
      : "not given";
  const text = [
    `New enquiry from ${enquiry.guest_name} <${enquiry.guest_email}>`,
    `Villa: ${enquiry.villa_id || "any"}`,
    `Dates: ${dates}`,
    `Reference: ${enquiry.id}`,
    "",
    enquiry.message,
  ].join("\n");

  return sendEmail({
    to,
    subject: `Orilla enquiry: ${enquiry.guest_name}`,
    text,
    replyTo: enquiry.guest_email,
  });
}
