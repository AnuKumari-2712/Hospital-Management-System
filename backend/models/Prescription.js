const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, default: "" },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicines: [medicineSchema],
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);