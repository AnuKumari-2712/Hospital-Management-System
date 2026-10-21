const Appointment = require("../models/Appointment");
const User = require("../models/User");
const MedicalRecord = require("../models/MedicalRecord");

// GET /api/v1/doctor/appointments/today
exports.getTodayAppointments = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({
      doctor: req.user.id,
      date: today,
    })
      .populate("patient", "fullName")
      .sort({ timeSlot: 1 });

    const formatted = appointments.map((a) => ({
      _id: a._id,
      patientId: a.patient?._id,
      patientName: a.patient?.fullName || "Patient",
      timeSlot: a.timeSlot,
      reason: a.reason,
      type: a.type,
      status: a.status,
    }));

    res.status(200).json({ success: true, appointments: formatted });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctor/appointments?status=xyz
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { doctor: req.user.id };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate("patient", "fullName")
      .sort({ date: -1 });

    const formatted = appointments.map((a) => ({
      _id: a._id,
      patientId: a.patient?._id,
      patientName: a.patient?.fullName || "Patient",
      date: a.date,
      timeSlot: a.timeSlot,
      reason: a.reason,
      type: a.type,
      status: a.status,
    }));

    res.status(200).json({ success: true, appointments: formatted });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/doctor/appointments/:id/status
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["confirmed", "cancelled", "completed"];

    if (!validStatuses.includes(status)) {
      res.statusCode = 400;
      return next(new Error("Invalid status value."));
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.statusCode = 404;
      return next(new Error("Appointment not found."));
    }

    if (appointment.doctor.toString() !== req.user.id) {
      res.statusCode = 403;
      return next(new Error("Not authorized."));
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, message: "Status updated." });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctor/patients
exports.getDoctorPatients = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate(
      "patient",
      "fullName email phone"
    );

    // Unique patients only
    const patientMap = new Map();
    appointments.forEach((a) => {
      if (a.patient && !patientMap.has(a.patient._id.toString())) {
        patientMap.set(a.patient._id.toString(), a.patient);
      }
    });

    const patients = Array.from(patientMap.values());

    res.status(200).json({ success: true, patients });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctor/patients/:id
exports.getPatientDetails = async (req, res, next) => {
  try {
    const patient = await User.findById(req.params.id).select(
      "fullName email phone"
    );

    if (!patient) {
      res.statusCode = 404;
      return next(new Error("Patient not found."));
    }

    const records = await MedicalRecord.find({
      patient: req.params.id,
      doctor: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      patient: {
        _id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        records,
      },
    });
  } catch (error) {
    next(error);
  }
};