const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
  updateProfile, // <-- Yeh import hona zaroori hai
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protect, changePassword);
router.put("/profile", protect, updateProfile); // <-- Yeh route add karein

module.exports = router;
