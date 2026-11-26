const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = conn;
    console.log("✅ MongoDB Connected");
    return conn;
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
