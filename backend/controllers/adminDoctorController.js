const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /api/v1/admin/doctors
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/doctors/:id
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password");
    if (!doctor) {
      res.statusCode = 404;
      return next(new Error("Doctor not found."));
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/doctors
exports.addDoctor = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, specialization, department } = req.body;

    if (!fullName || !email || !phone || !password) {
      res.statusCode = 400;
      return next(new Error("Name, email, phone, and password are required."));
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.statusCode = 400;
      return next(new Error("An account with this email already exists."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "doctor",
      specialization: specialization || "",
      department: department || "",
    });

    res.status(201).json({
      success: true,
      message: "Doctor added.",
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
        department: doctor.department,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admin/doctors/:id
exports.updateDoctor = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, specialization, department } = req.body;
    const updateData = { fullName, email, phone, specialization, department };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const doctor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "doctor" },
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!doctor) {
      res.statusCode = 404;
      return next(new Error("Doctor not found."));
    }

    res.status(200).json({ success: true, message: "Doctor updated.", doctor });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/admin/doctors/:id
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await User.findOneAndDelete({ _id: req.params.id, role: "doctor" });
    if (!doctor) {
      res.statusCode = 404;
      return next(new Error("Doctor not found."));
    }
    res.status(200).json({ success: true, message: "Doctor removed." });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/patients
exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.status(200).json({ success: true, patients });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/patients/:id
exports.getAdminPatientDetails = async (req, res, next) => {
  try {
    const Appointment = require("../models/Appointment");

    const patient = await User.findOne({ _id: req.params.id, role: "patient" }).select("-password");
    if (!patient) {
      res.statusCode = 404;
      return next(new Error("Patient not found."));
    }

    const appointments = await Appointment.find({ patient: req.params.id })
      .populate("doctor", "fullName")
      .sort({ date: -1 });

    const formattedAppointments = appointments.map((a) => ({
      _id: a._id,
      doctorName: a.doctor?.fullName || "Doctor",
      date: a.date,
      status: a.status,
    }));

    res.status(200).json({
      success: true,
      patient: {
        _id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        appointments: formattedAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};