import { connection, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { errorResponse, requireDatabase } from "@/lib/booking/http";
import { listEnquiries } from "@/lib/booking/repository";

/** Lists sold-out enquiries, newest first. */
export async function GET(request) {
  await connection();
  try {
    assertAdmin(request);
    requireDatabase();
    const enquiries = await listEnquiries({ limit: 200 });
    return NextResponse.json({ enquiries });
  } catch (error) {
    return errorResponse(error);
  }
}
