import { NextResponse } from "next/server";
import { createSessionForAdmin, getAdminRecord, sessionCookieOptions } from "@/lib/auth";
import { ADMIN_EMAIL, SESSION_COOKIE_NAME } from "@/lib/constants";
import { hashPassword } from "@/lib/password";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Only the configured admin email can access this panel." }, { status: 403 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const admin = await getAdminRecord();

  if (admin.passwordHash) {
    return NextResponse.json({ error: "Admin password is already set. Please log in." }, { status: 400 });
  }

  const { hash, salt } = hashPassword(password);
  admin.passwordHash = hash;
  admin.passwordSalt = salt;

  const token = await createSessionForAdmin(admin);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
  return response;
}
