const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const settingRoutes = require("./routes/settingRoutes");

dotenv.config(); // <--- Yeh line zaroori hai
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Transaction Routes (Yeh naya add karein)
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes);
// Budget Routes
const budgetRoutes = require("./routes/budgetRoutes");
app.use("/api/budget", budgetRoutes);

// Admin Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.use("/api/settings", settingRoutes);

const statsRoutes = require("./routes/statsRoutes");
app.use("/api/stats", statsRoutes);
// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SpendWise API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
