import { connection, NextResponse } from "next/server";
import { isIsoDate } from "@/lib/booking/dates";
import {
  errorResponse,
  requireDatabase,
  requireEmail,
  requireString,
} from "@/lib/booking/http";
import { createEnquiry, getVilla } from "@/lib/booking/repository";
import { sendEnquiryNotification } from "@/lib/email";
import { isLocale } from "@/lib/i18n";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 120;

/**
 * @param {string} message
 * @returns {never}
 */
function invalid(message) {
  const err = new Error(message);
  err.code = "VALIDATION";
  throw err;
}

/**
 * @param {unknown} value
 * @param {string} field
 * @returns {string | null}
 */
function optionalDate(value, field) {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || !isIsoDate(value)) {
    invalid(`${field} must be a valid YYYY-MM-DD date.`);
  }
  return value;
}

/**
 * Sold-out fallback: stores a guest enquiry (and emails the site contact when
 * ENQUIRY_NOTIFY_EMAIL is set). Works with the memory store and mock email.
 */
export async function POST(request) {
  await connection();
  try {
    requireDatabase();
    const body = await request.json().catch(() => ({}));

    // Honeypot: bots fill hidden fields. Pretend success, store nothing.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const guestName = requireString(body.guestName, "guestName");
    if (guestName.length > MAX_NAME_LENGTH) invalid("guestName is too long.");
    const guestEmail = requireEmail(body.guestEmail, "guestEmail");
    const message = requireString(body.message, "message");
    if (message.length > MAX_MESSAGE_LENGTH) invalid("message is too long.");

    const checkIn = optionalDate(body.checkIn, "checkIn");
    const checkOut = optionalDate(body.checkOut, "checkOut");
    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      invalid("Provide both checkIn and checkOut, or neither.");
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      invalid("checkOut must be after checkIn.");
    }

    let villaId = null;
    if (body.villaId != null && body.villaId !== "") {
      villaId = requireString(body.villaId, "villaId");
      if (!(await getVilla(villaId))) invalid("Villa not found.");
    }

    const enquiry = await createEnquiry({
      villaId,
      guestName,
      guestEmail,
      message,
      checkIn,
      checkOut,
      locale:
        typeof body.locale === "string" && isLocale(body.locale)
          ? body.locale
          : null,
    });

    const notified = await sendEnquiryNotification(enquiry);
    if (notified && !notified.ok) {
      console.error(
        `[enquiry] notification email failed for ${enquiry.id}:`,
        notified.error,
      );
    }

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
