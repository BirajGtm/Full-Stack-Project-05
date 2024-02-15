const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  vehicle_model: {
    type: String,
    required: true,
  },
  vehicle_color: {
    type: String,
    required: true,
  },
  license_plate: {
    type: String,
    default: false,
  },
});

module.exports = mongoose.model("Driver", driverSchema);
