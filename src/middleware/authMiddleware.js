const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Token ko get karein
      token = req.headers.authorization.split(" ")[1];

      // Token ko verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko database se dhoondein aur req.user mein save karein
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Yahan { protect } export ho raha hai
module.exports = { protect };
