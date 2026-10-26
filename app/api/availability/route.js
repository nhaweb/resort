import { connection, NextResponse } from "next/server";
import { validateStay } from "@/lib/booking/dates";
import { errorResponse, requireDatabase } from "@/lib/booking/http";
import {
  getVilla,
  isVillaAvailable,
  listActiveVillas,
} from "@/lib/booking/repository";
import { isLocale } from "@/lib/i18n";

export async function GET(request) {
  await connection();
  try {
    requireDatabase();
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const villaId = searchParams.get("villaId");
    const localeParam = searchParams.get("locale");
    const locale =
      localeParam && isLocale(localeParam) ? localeParam : undefined;

    const stay = validateStay(checkIn, checkOut, locale);
    if (!stay.ok) {
      const err = new Error(stay.error);
      err.code = "VALIDATION";
      throw err;
    }

    if (villaId) {
      const villa = await getVilla(villaId);
      if (!villa || !villa.active) {
        const err = new Error("Villa not found.");
        err.code = "VALIDATION";
        throw err;
      }
      const available = await isVillaAvailable(villaId, checkIn, checkOut);
      return NextResponse.json({
        checkIn,
        checkOut,
        nights: stay.nights,
        villaId,
        available,
        amountCents: available ? villa.nightly_rate_cents * stay.nights : null,
        currency: villa.currency,
      });
    }

    const villas = await listActiveVillas();
    const results = [];
    for (const villa of villas) {
      const available = await isVillaAvailable(villa.id, checkIn, checkOut);
      results.push({
        villaId: villa.id,
        name: villa.name,
        available,
        nightlyRateCents: villa.nightly_rate_cents,
        maxGuests: villa.max_guests,
        amountCents: available ? villa.nightly_rate_cents * stay.nights : null,
        currency: villa.currency,
      });
    }

    return NextResponse.json({
      checkIn,
      checkOut,
      nights: stay.nights,
      villas: results,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
