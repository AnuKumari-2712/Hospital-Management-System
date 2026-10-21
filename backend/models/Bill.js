const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    razorpayOrderId: { type: String, default: "" },
    transactionId: { type: String, default: "" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);