const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    isAvailable: { type: Boolean, default: false },
    startTime: { type: String, default: "09:00" },
    endTime: { type: String, default: "17:00" },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    days: [daySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);