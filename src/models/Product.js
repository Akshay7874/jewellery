const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
