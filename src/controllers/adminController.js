const User = require("../models/User");
const Transaction = require("../models/Transaction");

// @desc    Saare users ki list nikalna
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    // Password ko chor kar baaki data bhejein
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    System ki total stats nikalna (Admin ke liye)
// @route   GET /api/admin/stats
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Total platform revenue (agar aap koi fee le rahe hote)
    res.status(200).json({ totalUsers, totalTransactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getSystemStats };
