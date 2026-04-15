const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/api");
const asyncHandler = require("./utils/asyncHandler");
const { serveAdminEntry } = require("./controllers/publicController");

const app = express();
const publicDir = path.join(process.cwd(), "public");

app.use(express.json({ limit: "1mb" }));
app.get("/admin.html", asyncHandler(serveAdminEntry));
app.use(express.static(publicDir));
app.use("/api", apiRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(publicDir, "index.html"));
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (req.path.startsWith("/api/")) {
    return res.status(500).json({ error: error.message || "Server error." });
  }

  return res.status(500).send("Server error.");
});

module.exports = app;
