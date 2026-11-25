const Setting = require("../models/Setting");

// @desc    Get global settings
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Agar database khali hai toh default settings bana do
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      settings.maintenanceMode =
        req.body.maintenanceMode ?? settings.maintenanceMode;
      settings.allowRegistration =
        req.body.allowRegistration ?? settings.allowRegistration;
      settings.currency = req.body.currency ?? settings.currency;
    }
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
