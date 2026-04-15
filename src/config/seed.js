const { defaultSettings, defaultProducts, ADMIN_EMAIL } = require("./constants");
const Setting = require("../models/Setting");
const Product = require("../models/Product");
const Admin = require("../models/Admin");

async function seedDatabase() {
  const settingsCount = await Setting.countDocuments();
  if (!settingsCount) {
    await Setting.create({ ...defaultSettings, gmailUser: ADMIN_EMAIL });
  }

  const adminCount = await Admin.countDocuments();
  if (!adminCount) {
    await Admin.create({ email: ADMIN_EMAIL });
  }

  const productsCount = await Product.countDocuments();
  if (!productsCount) {
    await Product.insertMany(defaultProducts);
  }
}

module.exports = {
  seedDatabase
};
