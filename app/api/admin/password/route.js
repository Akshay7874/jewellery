import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getPasswordAlgorithm, hashPassword } from "@/lib/password";

export async function PUT(request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Please log in as admin." }, { status: 401 });
  }

  const { admin } = session;
  const body = await request.json();
  const currentPassword = String(body.currentPassword || "").trim();
  const nextPassword = String(body.nextPassword || "").trim();

  if (!getPasswordAlgorithm(currentPassword, admin.passwordSalt, admin.passwordHash)) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  if (nextPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
  }

  const { hash, salt } = hashPassword(nextPassword);
  admin.passwordHash = hash;
  admin.passwordSalt = salt;
  await admin.save();

  return NextResponse.json({ ok: true });
}
