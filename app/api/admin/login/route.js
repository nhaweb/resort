import { connection, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  adminSessionToken,
  isValidAdminSecret,
  requireAdminConfigured,
} from "@/lib/admin-auth";
import { errorResponse } from "@/lib/booking/http";

const cookieBase = {
  httpOnly: true,
  sameSite: /** @type {const} */ ("strict"),
  secure: process.env.NODE_ENV === "production",
  path: "/api/admin",
};

/** Exchanges the admin secret for an httpOnly session cookie. */
export async function POST(request) {
  await connection();
  try {
    requireAdminConfigured();
    const body = await request.json().catch(() => ({}));
    const secret = typeof body.secret === "string" ? body.secret : "";

    if (!isValidAdminSecret(secret)) {
      return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, adminSessionToken(), {
      ...cookieBase,
      maxAge: ADMIN_SESSION_SECONDS,
    });
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

/** Clears the admin session cookie. */
export async function DELETE() {
  await connection();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieBase, maxAge: 0 });
  return response;
}
