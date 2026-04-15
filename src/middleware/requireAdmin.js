const asyncHandler = require("../utils/asyncHandler");
const { getAuthToken, clearAdminCookie } = require("../utils/cookies");
const { findSession } = require("../utils/adminSession");

const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = getAuthToken(req);
  const { admin, session } = await findSession(token);

  if (!session) {
    clearAdminCookie(res);
    return res.status(401).json({ error: "Admin login required." });
  }

  req.admin = admin;
  req.adminToken = token;
  next();
});

module.exports = requireAdmin;
