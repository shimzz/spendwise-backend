const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const formatUser = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  token: generateToken(user._id),
});
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.status(200).json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please add all fields" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Password update karein
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Purana password check karein
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Naya password hash karke save karein
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, changePassword, updateProfile };
