const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Sirf admin hi settings change kar sakta hai
router
  .route("/")
  .get(protect, admin, getSettings)
  .put(protect, admin, updateSettings);

module.exports = router;
