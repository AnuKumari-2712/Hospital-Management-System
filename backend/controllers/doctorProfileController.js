const User = require("../models/User");
const Appointment = require("../models/Appointment");

// GET /api/v1/doctor/earnings
exports.getEarnings = async (req, res, next) => {
  try {
    // Placeholder: real earnings would come from a Payment/Bill model
    // linked to completed doctor appointments. For now, returns empty
    // structure so the frontend renders without crashing.
    res.status(200).json({
      success: true,
      earnings: {
        thisMonth: 0,
        totalEarnings: 0,
        pending: 0,
        transactions: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctor/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id });

    // Group by month for trend
    const trendMap = {};
    appointments.forEach((a) => {
      const month = a.date?.slice(0, 7); // "YYYY-MM"
      if (month) trendMap[month] = (trendMap[month] || 0) + 1;
    });
    const appointmentsTrend = Object.entries(trendMap)
      .sort()
      .map(([label, count]) => ({ label, count }));

    // Group by type
    const typeMap = {};
    appointments.forEach((a) => {
      typeMap[a.type] = (typeMap[a.type] || 0) + 1;
    });
    const departmentBreakdown = Object.entries(typeMap).map(([label, count]) => ({
      label,
      count,
    }));

    res.status(200).json({
      success: true,
      analytics: { appointmentsTrend, departmentBreakdown },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctor/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.statusCode = 404;
      return next(new Error("User not found."));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/doctor/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, specialization, department } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone, specialization, department },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};