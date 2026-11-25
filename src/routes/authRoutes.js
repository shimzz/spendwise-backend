const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
  updateProfile,
  deleteAccount, // <-- Import karein
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protect, changePassword);
router.put("/profile", protect, updateProfile);
router.delete("/delete-account", protect, deleteAccount); // <-- Naya Route

module.exports = router;
