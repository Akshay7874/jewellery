const crypto = require("crypto");
const Product = require("../models/Product");
const { sanitizeText } = require("../utils/sanitize");

function buildProductImage(file) {
  if (!file) {
    return "";
  }

  const mimeType = file.mimetype || "image/jpeg";
  const base64 = file.buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

async function createProduct(req, res) {
  const name = sanitizeText(req.body.name);
  const category = sanitizeText(req.body.category);
  const description = sanitizeText(req.body.description);
  const price = Number(req.body.price);
  const featured = req.body.featured === "true";

  if (!name || !category || !description || Number.isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Name, category, description, and price are required." });
  }

  const slug = `${name}-${crypto.randomUUID()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const product = await Product.create({
    id: slug,
    name,
    category,
    description,
    price,
    featured,
    imageUrl: buildProductImage(req.file)
  });

  const { _id, __v, ...rest } = product.toObject();
  res.status(201).json(rest);
}

async function deleteProduct(req, res) {
  const product = await Product.findOne({ id: req.params.id });

  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  await product.deleteOne();
  res.json({ success: true });
}

module.exports = {
  createProduct,
  deleteProduct
};
