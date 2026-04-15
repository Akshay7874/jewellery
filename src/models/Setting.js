const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    sellerName: { type: String, required: true },
    heroTitle: { type: String, required: true },
    heroText: { type: String, required: true },
    accentNote: { type: String, required: true },
    boutiqueLocation: { type: String, required: true },
    contactEmail: { type: String, required: true },
    gmailUser: { type: String, required: true },
    gmailAppPassword: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    atelierNote: { type: String, required: true },
    metalsNote: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Setting || mongoose.model("Setting", settingSchema);
