const express = require("express");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const requireAdmin = require("../middleware/requireAdmin");
const publicController = require("../controllers/publicController");
const adminAuthController = require("../controllers/adminAuthController");
const settingsController = require("../controllers/settingsController");
const productsController = require("../controllers/productsController");
const enquiryController = require("../controllers/enquiryController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

const router = express.Router();

router.get("/products", asyncHandler(publicController.getProducts));
router.post("/products", requireAdmin, upload.single("image"), asyncHandler(productsController.createProduct));
router.delete("/products/:id", requireAdmin, asyncHandler(productsController.deleteProduct));

router.get("/settings", asyncHandler(publicController.getPublicSettings));
router.get("/admin/settings", requireAdmin, asyncHandler(settingsController.getAdminSettings));
router.put("/admin/settings", requireAdmin, asyncHandler(settingsController.updateAdminSettings));

router.get("/admin/status", asyncHandler(adminAuthController.getAdminStatus));
router.get("/admin/session", asyncHandler(adminAuthController.getAdminSession));
router.post("/admin/setup", asyncHandler(adminAuthController.setupAdmin));
router.post("/admin/login", asyncHandler(adminAuthController.loginAdmin));
router.post("/admin/logout", requireAdmin, asyncHandler(adminAuthController.logoutAdmin));
router.put("/admin/password", requireAdmin, asyncHandler(adminAuthController.updateAdminPassword));

router.get("/enquiries", requireAdmin, asyncHandler(enquiryController.getEnquiries));
router.post("/enquiries", asyncHandler(enquiryController.createEnquiry));

module.exports = router;
