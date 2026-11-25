const express = require("express");
const router = express.Router();
const { setBudget, getBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");
const { checkMaintenance } = require("../middleware/maintenanceMiddleware"); // <-- Import

router
  .route("/")
  .post(protect, checkMaintenance, setBudget)
  .get(protect, checkMaintenance, getBudget);

module.exports = router;
