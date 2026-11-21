const express = require("express");
const router = express.Router();
const { setBudget, getBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, setBudget).get(protect, getBudget);

module.exports = router;
