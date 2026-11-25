const express = require("express");
const { protect } = require("../middleware/authMiddleware");
// 1. Maintenance middleware import karein
const { checkMaintenance } = require("../middleware/maintenanceMiddleware");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

// 2. Protect ke sath checkMaintenance bhi yahan add kar dein
router.use(protect, checkMaintenance);

router.route("/").get(getTransactions).post(addTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

module.exports = router;
