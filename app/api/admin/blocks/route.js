import { connection, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { isIsoDate } from "@/lib/booking/dates";
import {
  errorResponse,
  requireDatabase,
  requireString,
} from "@/lib/booking/http";
import {
  createInventoryBlock,
  getVilla,
  listInventoryBlocks,
} from "@/lib/booking/repository";

const MAX_REASON_LENGTH = 200;

/** Lists inventory blocks, soonest first. */
export async function GET(request) {
  await connection();
  try {
    assertAdmin(request);
    requireDatabase();
    const blocks = await listInventoryBlocks();
    return NextResponse.json({ blocks });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Creates an inventory block (end date exclusive, like a check-out). */
export async function POST(request) {
  await connection();
  try {
    assertAdmin(request);
    requireDatabase();
    const body = await request.json().catch(() => ({}));

    const villaId = requireString(body.villaId, "villaId");
    const startDate = requireString(body.startDate, "startDate");
    const endDate = requireString(body.endDate, "endDate");
    const reason =
      typeof body.reason === "string" && body.reason.trim()
        ? body.reason.trim().slice(0, MAX_REASON_LENGTH)
        : null;

    if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
      const err = new Error("Dates must be valid YYYY-MM-DD values.");
      err.code = "VALIDATION";
      throw err;
    }
    if (endDate <= startDate) {
      const err = new Error("End date must be after start date.");
      err.code = "VALIDATION";
      throw err;
    }
    if (!(await getVilla(villaId))) {
      const err = new Error("Villa not found.");
      err.code = "VALIDATION";
      throw err;
    }

    const block = await createInventoryBlock({
      villaId,
      startDate,
      endDate,
      reason,
    });
    return NextResponse.json({ block }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
