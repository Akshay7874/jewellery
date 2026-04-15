const path = require("path");
const Setting = require("../models/Setting");
const Product = require("../models/Product");
const { sanitizeText } = require("../utils/sanitize");
const { getAuthToken } = require("../utils/cookies");
const { findSession } = require("../utils/adminSession");

function sanitizePublicSettings(settings) {
  return {
    brandName: settings.brandName,
    sellerName: settings.sellerName,
    heroTitle: settings.heroTitle,
    heroText: settings.heroText,
    accentNote: settings.accentNote,
    boutiqueLocation: settings.boutiqueLocation,
    contactEmail: settings.contactEmail,
    whatsappNumber: settings.whatsappNumber,
    atelierNote: settings.atelierNote,
    metalsNote: settings.metalsNote
  };
}

async function serveAdminEntry(req, res) {
  const token = sanitizeText(getAuthToken(req));
  const { session } = await findSession(token);
  const page = session ? "admin.html" : "login.html";
  return res.sendFile(path.join(process.cwd(), "public", page));
}

async function getProducts(_req, res) {
  const products = await Product.find({}).sort({ featured: -1, createdAt: -1 }).lean();
  res.json(
    products.map(({ _id, __v, createdAt, updatedAt, ...product }) => ({
      ...product,
      createdAt
    }))
  );
}

async function getPublicSettings(_req, res) {
  const settings = await Setting.findOne().lean();
  res.json(sanitizePublicSettings(settings));
}

module.exports = {
  serveAdminEntry,
  getProducts,
  getPublicSettings,
  sanitizePublicSettings
};
