const { ADMIN_EMAIL } = require("../config/constants");
const Setting = require("../models/Setting");
const { sanitizeText } = require("../utils/sanitize");

async function getAdminSettings(_req, res) {
  const settings = await Setting.findOne().lean();
  const { _id, __v, ...rest } = settings;
  res.json(rest);
}

async function updateAdminSettings(req, res) {
  const settings = await Setting.findOne();

  settings.brandName = sanitizeText(req.body.brandName);
  settings.sellerName = sanitizeText(req.body.sellerName);
  settings.heroTitle = sanitizeText(req.body.heroTitle);
  settings.heroText = sanitizeText(req.body.heroText);
  settings.accentNote = sanitizeText(req.body.accentNote);
  settings.boutiqueLocation = sanitizeText(req.body.boutiqueLocation);
  settings.contactEmail = sanitizeText(req.body.contactEmail);
  settings.gmailUser = ADMIN_EMAIL;
  settings.gmailAppPassword = sanitizeText(req.body.gmailAppPassword) || settings.gmailAppPassword;
  settings.whatsappNumber = sanitizeText(req.body.whatsappNumber);
  settings.atelierNote = sanitizeText(req.body.atelierNote);
  settings.metalsNote = sanitizeText(req.body.metalsNote);

  await settings.save();
  const { _id, __v, ...rest } = settings.toObject();
  res.json(rest);
}

module.exports = {
  getAdminSettings,
  updateAdminSettings
};
