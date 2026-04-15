const crypto = require("crypto");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, admin) {
  if (!password || !admin.passwordSalt || !admin.passwordHash) {
    return false;
  }

  const hashed = crypto.scryptSync(password, admin.passwordSalt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hashed, "hex"), Buffer.from(admin.passwordHash, "hex"));
}

module.exports = {
  hashPassword,
  verifyPassword
};
