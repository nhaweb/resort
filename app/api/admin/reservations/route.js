import { connection, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { errorResponse, requireDatabase } from "@/lib/booking/http";
import { listReservations } from "@/lib/booking/repository";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

/** Lists reservations, newest first. `?limit=` (1-500, default 100). */
export async function GET(request) {
  await connection();
  try {
    assertAdmin(request);
    requireDatabase();

    const raw = Number(new URL(request.url).searchParams.get("limit"));
    const limit =
      Number.isInteger(raw) && raw > 0
        ? Math.min(raw, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const reservations = await listReservations({ limit });
    return NextResponse.json({ reservations });
  } catch (error) {
    return errorResponse(error);
  }
}
