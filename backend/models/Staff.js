const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);