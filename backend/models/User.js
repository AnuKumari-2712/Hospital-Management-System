const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // password kabhi query me by default nahi aayega
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    // Doctor-specific fields (optional for patient/admin)
    specialization: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    // Profile fields
    dateOfBirth: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    address: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    // OTP fields for password reset
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);