const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowRegistration: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: "PKR",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Setting", settingSchema);
