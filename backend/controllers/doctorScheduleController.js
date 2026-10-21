const Schedule = require("../models/Schedule");
const Leave = require("../models/Leave");

// GET /api/v1/doctor/schedule
exports.getSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({ doctor: req.user.id });
    res.status(200).json({ success: true, schedule: schedule?.days || [] });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/doctor/schedule
exports.updateSchedule = async (req, res, next) => {
  try {
    const { schedule } = req.body;

    const updated = await Schedule.findOneAndUpdate(
      { doctor: req.user.id },
      { doctor: req.user.id, days: schedule },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Schedule updated.", schedule: updated.days });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctor/leaves
exports.getLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ doctor: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/doctor/leaves
exports.requestLeave = async (req, res, next) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason) {
      res.statusCode = 400;
      return next(new Error("All fields are required."));
    }

    const leave = await Leave.create({
      doctor: req.user.id,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({ success: true, message: "Leave request submitted.", leave });
  } catch (error) {
    next(error);
  }
};