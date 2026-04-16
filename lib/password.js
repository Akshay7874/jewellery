import crypto from "crypto";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPbkdf2Password(password, salt, hash) {
  if (!password || !salt || !hash) {
    return false;
  }

  const computed = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
}

function verifyLegacyScryptPassword(password, salt, hash) {
  if (!password || !salt || !hash) {
    return false;
  }

  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
}

export function getPasswordAlgorithm(password, salt, hash) {
  if (verifyPbkdf2Password(password, salt, hash)) {
    return "pbkdf2";
  }

  if (verifyLegacyScryptPassword(password, salt, hash)) {
    return "scrypt";
  }

  return null;
}

export function verifyPassword(password, salt, hash) {
  return Boolean(getPasswordAlgorithm(password, salt, hash));
}
