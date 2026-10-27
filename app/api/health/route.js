import { connection, NextResponse } from "next/server";
import { paymentMode } from "@/lib/booking/config";
import { bookingStoreMode } from "@/lib/booking/store";
import { hasDatabase, query } from "@/lib/db";

export async function GET() {
  await connection();
  const store = bookingStoreMode();
  const payload = {
    ok: true,
    service: "pml",
    paymentMode: paymentMode(),
    store,
    database: hasDatabase() ? "configured" : "missing",
    time: new Date().toISOString(),
  };

  if (store === "memory") {
    return NextResponse.json({
      ...payload,
      database: "memory",
    });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ ...payload, ok: false }, { status: 503 });
  }

  try {
    await query("SELECT 1");
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        ...payload,
        ok: false,
        database: "error",
        error: error instanceof Error ? error.message : "db error",
      },
      { status: 503 },
    );
  }
}
