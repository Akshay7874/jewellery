function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

module.exports = {
  sanitizeText
};
