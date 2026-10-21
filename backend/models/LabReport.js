const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testName: { type: String, required: true },
    date: { type: String, required: true },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    fileName: { type: String, default: "lab-report.pdf" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabReport", labReportSchema);