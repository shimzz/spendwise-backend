const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");
const { checkMaintenance } = require("../middleware/maintenanceMiddleware"); // <-- Import

router.get("/", protect, checkMaintenance, getDashboardStats);

module.exports = router;
