const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /api/v1/patients/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// PATCH /api/v1/patients/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, gender, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email, phone, dateOfBirth, gender, address },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

// PATCH /api/v1/patients/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};