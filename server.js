const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = "akshaykar7874@gmail.com";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

const rootDir = __dirname;
const publicDir = path.join(rootDir, "public");
const dataDir = path.join(rootDir, "data");
const uploadsDir = path.join(rootDir, "uploads");
const productsPath = path.join(dataDir, "products.json");
const settingsPath = path.join(dataDir, "settings.json");
const enquiriesPath = path.join(dataDir, "enquiries.json");
const adminPath = path.join(dataDir, "admin.json");

const defaultSettings = {
  brandName: "Muskan Jewellery",
  sellerName: "Muskan",
  heroTitle: "Gold and silver jewellery that turns every glance into a celebration.",
  heroText:
    "Muskan Jewellery presents bridal sparkle, festive statements, and everyday heirlooms with a luxurious online shopping experience.",
  accentNote: "Curated by Muskan for weddings, gifting, and unforgettable occasions.",
  boutiqueLocation: "Delhi, India",
  contactEmail: ADMIN_EMAIL,
  gmailUser: ADMIN_EMAIL,
  gmailAppPassword: "",
  whatsappNumber: "+91 98765 43210",
  atelierNote: "Handpicked gold, silver, polki, and festive sets styled with boutique attention.",
  metalsNote: "Gold brilliance, silver glow, and bridal craftsmanship in one destination."
};

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    name: "Muskan Bridal Radiance Set",
    category: "Bridal Gold",
    description: "Layered necklace, earrings, and maang tikka styled for grand wedding entries.",
    price: 148000,
    featured: true,
    imageUrl: "",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Silver Moonlight Choker",
    category: "Silver Edit",
    description: "A luminous choker with polished silver curves and evening-ready shine.",
    price: 32999,
    featured: true,
    imageUrl: "",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Golden Blossom Earrings",
    category: "Festive Gold",
    description: "Lightweight statement earrings designed for sangeet, gifting, and festive styling.",
    price: 18499,
    featured: false,
    imageUrl: "",
    createdAt: new Date().toISOString()
  }
];

const defaultAdmin = {
  email: ADMIN_EMAIL,
  passwordHash: "",
  passwordSalt: "",
  sessions: []
};

function ensureStorage() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });

  if (!fs.existsSync(productsPath)) {
    fs.writeFileSync(productsPath, JSON.stringify(defaultProducts, null, 2));
  }

  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
  }

  if (!fs.existsSync(enquiriesPath)) {
    fs.writeFileSync(enquiriesPath, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(adminPath)) {
    fs.writeFileSync(adminPath, JSON.stringify(defaultAdmin, null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAdmin(admin) {
  const now = Date.now();
  const sessions = Array.isArray(admin.sessions)
    ? admin.sessions.filter((session) => session && session.token && new Date(session.expiresAt).getTime() > now)
    : [];

  return {
    ...defaultAdmin,
    ...admin,
    email: ADMIN_EMAIL,
    sessions
  };
}

function getAdminData() {
  return normalizeAdmin(readJson(adminPath, defaultAdmin));
}

function saveAdminData(admin) {
  writeJson(adminPath, normalizeAdmin(admin));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, admin) {
  if (!password || !admin.passwordSalt || !admin.passwordHash) {
    return false;
  }

  const hashed = crypto.scryptSync(password, admin.passwordSalt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hashed, "hex"), Buffer.from(admin.passwordHash, "hex"));
}

function createSession(admin) {
  const token = crypto.randomBytes(24).toString("hex");
  admin.sessions.push({
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString()
  });
  saveAdminData(admin);
  return token;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";

  return header.split(";").reduce((cookies, part) => {
    const trimmed = part.trim();

    if (!trimmed) {
      return cookies;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function setAdminCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `adminToken=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(
      SESSION_MAX_AGE_MS / 1000
    )}`
  );
}

function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", "adminToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0");
}

function getAuthToken(req) {
  return sanitizeText(req.headers["x-admin-token"]) || sanitizeText(parseCookies(req).adminToken);
}

function getSessionRecord(token) {
  const admin = getAdminData();

  if (!token) {
    return { admin, session: null };
  }

  const session = admin.sessions.find((item) => item.token === token);
  return { admin, session: session || null };
}

function requireAdmin(req, res, next) {
  const token = getAuthToken(req);
  const { admin, session } = getSessionRecord(token);

  if (!session) {
    clearAdminCookie(res);
    return res.status(401).json({ error: "Admin login required." });
  }

  req.admin = admin;
  req.adminToken = token;
  return next();
}

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

function sanitizeAdminStatus(admin) {
  return {
    email: admin.email,
    hasPassword: Boolean(admin.passwordHash && admin.passwordSalt)
  };
}

ensureStorage();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeBaseName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safeBaseName}`);
  }
});

const upload = multer({ storage });

app.use(express.json({ limit: "1mb" }));

app.get("/admin.html", (req, res) => {
  const token = getAuthToken(req);
  const { session } = getSessionRecord(token);
  const page = session ? "admin.html" : "login.html";
  return res.sendFile(path.join(publicDir, page));
});

app.use("/uploads", express.static(uploadsDir));
app.use(express.static(publicDir));

app.get("/api/products", (_req, res) => {
  const products = readJson(productsPath, defaultProducts).sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(products);
});

app.get("/api/settings", (_req, res) => {
  const settings = readJson(settingsPath, defaultSettings);
  res.json(sanitizePublicSettings(settings));
});

app.get("/api/admin/status", (_req, res) => {
  const admin = getAdminData();
  res.json(sanitizeAdminStatus(admin));
});

app.get("/api/admin/session", (req, res) => {
  const token = getAuthToken(req);
  const { admin, session } = getSessionRecord(token);

  if (!session) {
    clearAdminCookie(res);
    return res.status(401).json({ error: "Admin login required." });
  }

  return res.json({
    authenticated: true,
    email: admin.email
  });
});

app.post("/api/admin/setup", (req, res) => {
  const admin = getAdminData();
  const email = sanitizeText(req.body.email).toLowerCase();
  const password = sanitizeText(req.body.password);

  if (admin.passwordHash) {
    return res.status(400).json({ error: "Admin password is already configured. Please log in." });
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: `Only ${ADMIN_EMAIL} can activate the admin panel.` });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  const { salt, hash } = hashPassword(password);
  admin.passwordSalt = salt;
  admin.passwordHash = hash;
  const token = createSession(admin);
  setAdminCookie(res, token);

  return res.status(201).json({
    success: true,
    email: admin.email
  });
});

app.post("/api/admin/login", (req, res) => {
  const admin = getAdminData();
  const email = sanitizeText(req.body.email).toLowerCase();
  const password = sanitizeText(req.body.password);

  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: `Only ${ADMIN_EMAIL} can access the admin panel.` });
  }

  if (!admin.passwordHash) {
    return res.status(400).json({ error: "Set an admin password first." });
  }

  if (!verifyPassword(password, admin)) {
    return res.status(401).json({ error: "Incorrect admin password." });
  }

  const token = createSession(admin);
  setAdminCookie(res, token);

  return res.json({
    success: true,
    email: admin.email
  });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const admin = req.admin;
  admin.sessions = admin.sessions.filter((session) => session.token !== req.adminToken);
  saveAdminData(admin);
  clearAdminCookie(res);
  res.json({ success: true });
});

app.put("/api/admin/password", requireAdmin, (req, res) => {
  const currentPassword = sanitizeText(req.body.currentPassword);
  const nextPassword = sanitizeText(req.body.nextPassword);

  if (!verifyPassword(currentPassword, req.admin)) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  if (nextPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long." });
  }

  const { salt, hash } = hashPassword(nextPassword);
  req.admin.passwordSalt = salt;
  req.admin.passwordHash = hash;
  saveAdminData(req.admin);

  return res.json({ success: true });
});

app.get("/api/admin/settings", requireAdmin, (_req, res) => {
  const settings = readJson(settingsPath, defaultSettings);
  res.json(settings);
});

app.put("/api/admin/settings", requireAdmin, (req, res) => {
  const currentSettings = readJson(settingsPath, defaultSettings);
  const nextSettings = {
    ...currentSettings,
    brandName: sanitizeText(req.body.brandName),
    sellerName: sanitizeText(req.body.sellerName),
    heroTitle: sanitizeText(req.body.heroTitle),
    heroText: sanitizeText(req.body.heroText),
    accentNote: sanitizeText(req.body.accentNote),
    boutiqueLocation: sanitizeText(req.body.boutiqueLocation),
    contactEmail: sanitizeText(req.body.contactEmail),
    gmailUser: ADMIN_EMAIL,
    gmailAppPassword: sanitizeText(req.body.gmailAppPassword),
    whatsappNumber: sanitizeText(req.body.whatsappNumber),
    atelierNote: sanitizeText(req.body.atelierNote),
    metalsNote: sanitizeText(req.body.metalsNote)
  };

  writeJson(settingsPath, nextSettings);
  res.json(nextSettings);
});

app.post("/api/products", requireAdmin, upload.single("image"), (req, res) => {
  const name = sanitizeText(req.body.name);
  const category = sanitizeText(req.body.category);
  const description = sanitizeText(req.body.description);
  const price = Number(req.body.price);
  const featured = req.body.featured === "true";

  if (!name || !category || !description || Number.isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Name, category, description, and price are required." });
  }

  const products = readJson(productsPath, defaultProducts);
  const product = {
    id: crypto.randomUUID(),
    name,
    category,
    description,
    price,
    featured,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    createdAt: new Date().toISOString()
  };

  products.unshift(product);
  writeJson(productsPath, products);

  return res.status(201).json(product);
});

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const products = readJson(productsPath, defaultProducts);
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  const filteredProducts = products.filter((item) => item.id !== req.params.id);
  writeJson(productsPath, filteredProducts);

  if (product.imageUrl) {
    const imagePath = path.join(rootDir, product.imageUrl.replace(/^\//, ""));

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  return res.json({ success: true });
});

app.get("/api/enquiries", requireAdmin, (_req, res) => {
  const enquiries = readJson(enquiriesPath, []);
  res.json(enquiries);
});

app.post("/api/enquiries", async (req, res) => {
  const settings = readJson(settingsPath, defaultSettings);
  const products = readJson(productsPath, defaultProducts);
  const enquiries = readJson(enquiriesPath, []);

  const name = sanitizeText(req.body.name);
  const email = sanitizeText(req.body.email);
  const phone = sanitizeText(req.body.phone);
  const message = sanitizeText(req.body.message);
  const productId = sanitizeText(req.body.productId);
  const product = products.find((item) => item.id === productId);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  if (!settings.gmailUser || !settings.gmailAppPassword) {
    return res.status(400).json({
      error: "Admin must add the Gmail app password before receiving enquiries."
    });
  }

  const enquiry = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    message,
    productId,
    productName: product ? product.name : "General enquiry",
    createdAt: new Date().toISOString()
  };

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: settings.gmailUser,
      pass: settings.gmailAppPassword
    }
  });

  try {
    await transport.sendMail({
      from: settings.gmailUser,
      to: settings.contactEmail || settings.gmailUser,
      replyTo: email,
      subject: `New jewellery enquiry from ${name}`,
      text: [
        `Customer: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Product: ${enquiry.productName}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2419;">
          <h2>New jewellery enquiry</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Product:</strong> ${enquiry.productName}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `
    });

    enquiries.unshift(enquiry);
    writeJson(enquiriesPath, enquiries);
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "Gmail could not send the enquiry. Check the Gmail app password in admin settings."
    });
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Jewellery site running on http://localhost:${PORT}`);
});
