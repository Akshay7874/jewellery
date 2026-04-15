const mongoose = require("mongoose");

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to your .env file before starting the server.");
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || "jewellery"
  });
}

module.exports = {
  connectDatabase
};
