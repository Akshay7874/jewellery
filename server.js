const dotenv = require("dotenv");
const app = require("./src/app");
const { connectDatabase } = require("./src/config/db");
const { seedDatabase } = require("./src/config/seed");

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Jewellery site running on http://localhost:${PORT}`);
    console.log(`MongoDB connected to ${process.env.MONGODB_DB_NAME || "jewellery"}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start jewellery site:", error.message);
  process.exit(1);
});
