module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/constants.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_EMAIL",
    ()=>ADMIN_EMAIL,
    "SESSION_COOKIE_NAME",
    ()=>SESSION_COOKIE_NAME,
    "SESSION_MAX_AGE_SECONDS",
    ()=>SESSION_MAX_AGE_SECONDS,
    "defaultProducts",
    ()=>defaultProducts,
    "defaultSettings",
    ()=>defaultSettings
]);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "akshaykar7874@gmail.com";
const SESSION_COOKIE_NAME = "muskan_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const defaultSettings = {
    brandName: "Muskan Jewellery",
    sellerName: "Muskan",
    heroTitle: "Gold and silver jewellery that turns every glance into a celebration.",
    heroText: "Muskan Jewellery brings bridal sparkle, gifting elegance, and festive luxury into one premium online showroom.",
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
        id: "muskan-bridal-radiance",
        name: "Muskan Bridal Radiance Set",
        category: "Bridal Gold",
        description: "Layered necklace, earrings, and maang tikka styled for grand wedding entries.",
        price: 148000,
        featured: true,
        imageUrl: ""
    },
    {
        id: "silver-moonlight-choker",
        name: "Silver Moonlight Choker",
        category: "Silver Edit",
        description: "A luminous choker with polished silver curves and evening-ready shine.",
        price: 32999,
        featured: true,
        imageUrl: ""
    },
    {
        id: "golden-blossom-earrings",
        name: "Golden Blossom Earrings",
        category: "Festive Gold",
        description: "Lightweight statement earrings designed for gifting, weddings, and festive styling.",
        price: 18499,
        featured: false,
        imageUrl: ""
    }
];
}),
"[project]/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDatabase",
    ()=>connectDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const { MONGODB_URI, MONGODB_DB_NAME } = process.env;
if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables.");
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, {
            dbName: MONGODB_DB_NAME || undefined,
            bufferCommands: false
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
}),
"[project]/models/Admin.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const sessionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    _id: false
});
const adminSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        default: ""
    },
    passwordSalt: {
        type: String,
        default: ""
    },
    sessions: {
        type: [
            sessionSchema
        ],
        default: []
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Admin || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Admin", adminSchema);
}),
"[project]/models/Product.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const productSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Product || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Product", productSchema);
}),
"[project]/models/Setting.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const settingSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    brandName: {
        type: String,
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    heroTitle: {
        type: String,
        required: true
    },
    heroText: {
        type: String,
        required: true
    },
    accentNote: {
        type: String,
        required: true
    },
    boutiqueLocation: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    gmailUser: {
        type: String,
        required: true
    },
    gmailAppPassword: {
        type: String,
        default: ""
    },
    whatsappNumber: {
        type: String,
        default: ""
    },
    atelierNote: {
        type: String,
        required: true
    },
    metalsNote: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Setting || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Setting", settingSchema);
}),
"[project]/lib/seed.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureSeeded",
    ()=>ensureSeeded
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Admin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Product.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Setting$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Setting.js [app-route] (ecmascript)");
;
;
;
;
;
let seedPromise;
async function ensureSeeded() {
    if (!seedPromise) {
        seedPromise = (async ()=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDatabase"])();
            if (!await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Setting$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments()) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Setting$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSettings"],
                    gmailUser: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_EMAIL"]
                });
            }
            if (!await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments()) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                    email: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_EMAIL"],
                    passwordHash: "",
                    passwordSalt: "",
                    sessions: []
                });
            }
            if (!await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments()) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultProducts"]);
            }
        })();
    }
    return seedPromise;
}
}),
"[project]/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCurrentAdminSession",
    ()=>clearCurrentAdminSession,
    "createSessionForAdmin",
    ()=>createSessionForAdmin,
    "getAdminRecord",
    ()=>getAdminRecord,
    "getAdminStatus",
    ()=>getAdminStatus,
    "getCurrentAdminSession",
    ()=>getCurrentAdminSession,
    "requireAdminSession",
    ()=>requireAdminSession,
    "sessionCookieOptions",
    ()=>sessionCookieOptions
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Admin.js [app-route] (ecmascript)");
;
;
;
;
;
const sessionCookieOptions = {
    httpOnly: true,
    secure: ("TURBOPACK compile-time value", "development") === "production",
    sameSite: "lax",
    path: "/",
    maxAge: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_MAX_AGE_SECONDS"]
};
async function pruneSessions(admin) {
    const now = Date.now();
    const nextSessions = (admin.sessions || []).filter((session)=>new Date(session.expiresAt).getTime() > now);
    if (nextSessions.length !== admin.sessions.length) {
        admin.sessions = nextSessions;
        await admin.save();
    }
    return admin;
}
async function getAdminRecord() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureSeeded"])();
    const admin = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Admin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        email: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_EMAIL"]
    });
    if (!admin) {
        throw new Error("Admin record is missing.");
    }
    return pruneSessions(admin);
}
async function getAdminStatus() {
    const admin = await getAdminRecord();
    return {
        email: admin.email,
        hasPassword: Boolean(admin.passwordHash)
    };
}
async function createSessionForAdmin(admin) {
    const token = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(24).toString("hex");
    admin.sessions.push({
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_MAX_AGE_SECONDS"] * 1000)
    });
    await admin.save();
    return token;
}
async function getCurrentAdminSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"])?.value;
    if (!token) {
        return null;
    }
    const admin = await getAdminRecord();
    const session = admin.sessions.find((item)=>item.token === token);
    if (!session) {
        return null;
    }
    return {
        email: admin.email,
        token,
        admin
    };
}
async function requireAdminSession() {
    const session = await getCurrentAdminSession();
    if (!session) {
        return null;
    }
    return session;
}
async function clearCurrentAdminSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"])?.value;
    if (!token) {
        return;
    }
    const admin = await getAdminRecord();
    admin.sessions = admin.sessions.filter((item)=>item.token !== token);
    await admin.save();
}
}),
"[project]/lib/password.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPasswordAlgorithm",
    ()=>getPasswordAlgorithm,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function hashPassword(password) {
    const salt = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(16).toString("hex");
    const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
    return {
        salt,
        hash
    };
}
function verifyPbkdf2Password(password, salt, hash) {
    if (!password || !salt || !hash) {
        return false;
    }
    const computed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
}
function verifyLegacyScryptPassword(password, salt, hash) {
    if (!password || !salt || !hash) {
        return false;
    }
    const computed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].scryptSync(password, salt, 64).toString("hex");
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
}
function getPasswordAlgorithm(password, salt, hash) {
    if (verifyPbkdf2Password(password, salt, hash)) {
        return "pbkdf2";
    }
    if (verifyLegacyScryptPassword(password, salt, hash)) {
        return "scrypt";
    }
    return null;
}
function verifyPassword(password, salt, hash) {
    return Boolean(getPasswordAlgorithm(password, salt, hash));
}
}),
"[project]/app/api/admin/login/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/password.js [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    if (email !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_EMAIL"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Only the configured admin email can access this panel."
        }, {
            status: 403
        });
    }
    const admin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminRecord"])();
    if (!admin.passwordHash) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Admin password is not set yet. Please create it first."
        }, {
            status: 400
        });
    }
    const algorithm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPasswordAlgorithm"])(password, admin.passwordSalt, admin.passwordHash);
    if (!algorithm) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Incorrect password."
        }, {
            status: 401
        });
    }
    if (algorithm === "scrypt") {
        const { hash, salt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(password);
        admin.passwordHash = hash;
        admin.passwordSalt = salt;
    }
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionForAdmin"])(admin);
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true
    });
    response.cookies.set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"], token, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionCookieOptions"]);
    return response;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__113r2-q._.js.map