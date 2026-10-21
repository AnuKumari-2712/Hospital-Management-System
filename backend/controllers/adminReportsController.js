const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

// GET /api/v1/admin/analytics
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const bills = await Bill.find({ status: "paid" });
    const revenueMap = {};
    bills.forEach((b) => {
      const month = b.paidAt ? b.paidAt.toISOString().slice(0, 7) : "unknown";
      revenueMap[month] = (revenueMap[month] || 0) + b.amount;
    });
    const revenueTrend = Object.entries(revenueMap)
      .sort()
      .map(([label, amount]) => ({ label, amount }));

    const appointments = await Appointment.find();
    const deptMap = {};
    appointments.forEach((a) => {
      deptMap[a.department] = (deptMap[a.department] || 0) + 1;
    });
    const departmentLoad = Object.entries(deptMap).map(([label, count]) => ({ label, count }));

    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const roleDistribution = roleCounts.map((r) => ({ label: r._id, count: r.count }));

    res.status(200).json({
      success: true,
      analytics: { revenueTrend, departmentLoad, roleDistribution },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/reports/:type
exports.downloadReport = async (req, res, next) => {
  try {
    // Placeholder: PDF generation library (e.g. pdfkit) would build the
    // actual file here. For now, returns a simple text-based placeholder
    // so the frontend download flow can be tested end-to-end.
    const { type } = req.params;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${type}-report.pdf"`);
    res.send(Buffer.from(`Report type: ${type}\nGenerated: ${new Date().toISOString()}`));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/feedback
exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .populate("patient", "fullName")
      .sort({ createdAt: -1 });

    const formatted = feedback.map((f) => ({
      _id: f._id,
      patientName: f.patient?.fullName || "Patient",
      rating: f.rating,
      comment: f.comment,
      date: f.createdAt?.toISOString().split("T")[0],
    }));

    res.status(200).json({ success: true, feedback: formatted });
  } catch (error) {
    next(error);
  }
};