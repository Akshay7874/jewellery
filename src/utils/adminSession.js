const crypto = require("crypto");
const Admin = require("../models/Admin");
const { SESSION_MAX_AGE_MS } = require("../config/constants");

async function getAdminRecord() {
  const admin = await Admin.findOne();
  if (!admin) {
    throw new Error("Admin record is missing. Seed the database first.");
  }

  const now = Date.now();
  admin.sessions = (admin.sessions || []).filter((session) => new Date(session.expiresAt).getTime() > now);
  await admin.save();
  return admin;
}

async function createSession(admin) {
  const token = crypto.randomBytes(24).toString("hex");
  admin.sessions.push({
    token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS)
  });
  await admin.save();
  return token;
}

async function findSession(token) {
  const admin = await getAdminRecord();
  if (!token) {
    return { admin, session: null };
  }

  const session = (admin.sessions || []).find((item) => item.token === token) || null;
  return { admin, session };
}

module.exports = {
  getAdminRecord,
  createSession,
  findSession
};
