const { ADMIN_EMAIL } = require("../config/constants");
const { sanitizeText } = require("../utils/sanitize");
const { hashPassword, verifyPassword } = require("../utils/password");
const { getAuthToken, setAdminCookie, clearAdminCookie } = require("../utils/cookies");
const { getAdminRecord, createSession, findSession } = require("../utils/adminSession");

function sanitizeAdminStatus(admin) {
  return {
    email: admin.email,
    hasPassword: Boolean(admin.passwordHash && admin.passwordSalt)
  };
}

async function getAdminStatus(_req, res) {
  const admin = await getAdminRecord();
  res.json(sanitizeAdminStatus(admin));
}

async function getAdminSession(req, res) {
  const token = sanitizeText(getAuthToken(req));
  const { admin, session } = await findSession(token);

  if (!session) {
    clearAdminCookie(res);
    return res.status(401).json({ error: "Admin login required." });
  }

  return res.json({ authenticated: true, email: admin.email });
}

async function setupAdmin(req, res) {
  const admin = await getAdminRecord();
  const email = sanitizeText(req.body.email).toLowerCase();
  const password = sanitizeText(req.body.password);

  if (admin.passwordHash) {
    return res.status(400).json({ error: "Admin password is already configured. Please log in." });
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: `Only ${ADMIN_EMAIL} can activate the admin panel.` });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  const { salt, hash } = hashPassword(password);
  admin.passwordSalt = salt;
  admin.passwordHash = hash;
  await admin.save();
  const token = await createSession(admin);
  setAdminCookie(res, token);

  return res.status(201).json({ success: true, email: admin.email });
}

async function loginAdmin(req, res) {
  const admin = await getAdminRecord();
  const email = sanitizeText(req.body.email).toLowerCase();
  const password = sanitizeText(req.body.password);

  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: `Only ${ADMIN_EMAIL} can access the admin panel.` });
  }

  if (!admin.passwordHash) {
    return res.status(400).json({ error: "Set an admin password first." });
  }

  if (!verifyPassword(password, admin)) {
    return res.status(401).json({ error: "Incorrect admin password." });
  }

  const token = await createSession(admin);
  setAdminCookie(res, token);
  return res.json({ success: true, email: admin.email });
}

async function logoutAdmin(req, res) {
  req.admin.sessions = (req.admin.sessions || []).filter((session) => session.token !== req.adminToken);
  await req.admin.save();
  clearAdminCookie(res);
  res.json({ success: true });
}

async function updateAdminPassword(req, res) {
  const currentPassword = sanitizeText(req.body.currentPassword);
  const nextPassword = sanitizeText(req.body.nextPassword);

  if (!verifyPassword(currentPassword, req.admin)) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  if (nextPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long." });
  }

  const { salt, hash } = hashPassword(nextPassword);
  req.admin.passwordSalt = salt;
  req.admin.passwordHash = hash;
  await req.admin.save();

  res.json({ success: true });
}

module.exports = {
  getAdminStatus,
  getAdminSession,
  setupAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdminPassword
};
