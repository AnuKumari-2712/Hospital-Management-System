const Department = require("../models/Department");
const Staff = require("../models/Staff");
const Appointment = require("../models/Appointment");

// GET /api/v1/admin/departments
exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/departments
exports.addDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.statusCode = 400;
      return next(new Error("Department name is required."));
    }
    const department = await Department.create({ name, description: description || "" });
    res.status(201).json({ success: true, message: "Department added.", department });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/admin/departments/:id
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      res.statusCode = 404;
      return next(new Error("Department not found."));
    }
    res.status(200).json({ success: true, message: "Department removed." });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/staff
exports.getAllStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, staff });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/staff
exports.addStaff = async (req, res, next) => {
  try {
    const { fullName, role, email } = req.body;
    if (!fullName || !role || !email) {
      res.statusCode = 400;
      return next(new Error("Name, role, and email are required."));
    }
    const staff = await Staff.create({ fullName, role, email });
    res.status(201).json({ success: true, message: "Staff added.", staff });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/admin/staff/:id
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      res.statusCode = 404;
      return next(new Error("Staff member not found."));
    }
    res.status(200).json({ success: true, message: "Staff removed." });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/appointments
exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "fullName")
      .populate("doctor", "fullName")
      .sort({ date: -1 });

    const formatted = appointments.map((a) => ({
      _id: a._id,
      patientName: a.patient?.fullName || "Patient",
      doctorName: a.doctor?.fullName || "Doctor",
      date: a.date,
      timeSlot: a.timeSlot,
      status: a.status,
    }));

    res.status(200).json({ success: true, appointments: formatted });
  } catch (error) {
    next(error);
  }
};