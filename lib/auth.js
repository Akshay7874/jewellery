import crypto from "crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import Admin from "@/models/Admin";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS
};

async function pruneSessions(admin) {
  const now = Date.now();
  const nextSessions = (admin.sessions || []).filter((session) => new Date(session.expiresAt).getTime() > now);

  if (nextSessions.length !== admin.sessions.length) {
    admin.sessions = nextSessions;
    await admin.save();
  }

  return admin;
}

export async function getAdminRecord() {
  await ensureSeeded();
  const admin = await Admin.findOne({ email: ADMIN_EMAIL });

  if (!admin) {
    throw new Error("Admin record is missing.");
  }

  return pruneSessions(admin);
}

export async function getAdminStatus() {
  const admin = await getAdminRecord();
  return { email: admin.email, hasPassword: Boolean(admin.passwordHash) };
}

export async function createSessionForAdmin(admin) {
  const token = crypto.randomBytes(24).toString("hex");
  admin.sessions.push({
    token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
  });
  await admin.save();
  return token;
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const admin = await getAdminRecord();
  const session = admin.sessions.find((item) => item.token === token);

  if (!session) {
    return null;
  }

  return { email: admin.email, token, admin };
}

export async function requireAdminSession() {
  const session = await getCurrentAdminSession();

  if (!session) {
    return null;
  }

  return session;
}

export async function clearCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return;
  }

  const admin = await getAdminRecord();
  admin.sessions = admin.sessions.filter((item) => item.token !== token);
  await admin.save();
}
