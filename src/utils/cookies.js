const { SESSION_MAX_AGE_MS } = require("../config/constants");

function parseCookies(req) {
  const header = req.headers.cookie || "";

  return header.split(";").reduce((cookies, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return cookies;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return cookies;
    }

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function getAuthToken(req) {
  return req.headers["x-admin-token"] || parseCookies(req).adminToken || "";
}

function setAdminCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `adminToken=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(
      SESSION_MAX_AGE_MS / 1000
    )}`
  );
}

function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", "adminToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0");
}

module.exports = {
  getAuthToken,
  setAdminCookie,
  clearAdminCookie
};
