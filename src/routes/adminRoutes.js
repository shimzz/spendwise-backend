const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSystemStats,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Dono middlewares lagayein (Pehle login check, phir admin check)
router.get("/users", protect, admin, getAllUsers);
router.get("/stats", protect, admin, getSystemStats);

module.exports = router;
