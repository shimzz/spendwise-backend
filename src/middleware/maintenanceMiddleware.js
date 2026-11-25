const Setting = require("../models/Setting");

const checkMaintenance = async (req, res, next) => {
  try {
    const settings = await Setting.findOne();

    // Agar maintenance mode ON hai AUR user Admin nahi hai, toh block karein
    if (settings && settings.maintenanceMode && req.user?.role !== "admin") {
      return res.status(503).json({
        message:
          "System is currently under maintenance. Please try again later.",
      });
    }

    // Agar sab theek hai, toh aage badhne dein
    next();
  } catch (error) {
    console.error("Maintenance Check Error:", error);
    next(); // Error aane par block na karein, aage jane dein
  }
};

module.exports = { checkMaintenance };
