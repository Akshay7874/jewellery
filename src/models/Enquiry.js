const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    productId: { type: String, default: "" },
    productName: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
