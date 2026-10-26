import { connection, NextResponse } from "next/server";
import { errorResponse, requireDatabase } from "@/lib/booking/http";
import { listActiveVillas } from "@/lib/booking/repository";

export async function GET() {
  await connection();
  try {
    requireDatabase();
    const villas = await listActiveVillas();
    return NextResponse.json({
      villas: villas.map((v) => ({
        id: v.id,
        name: v.name,
        nightlyRateCents: v.nightly_rate_cents,
        maxGuests: v.max_guests,
        currency: v.currency,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
