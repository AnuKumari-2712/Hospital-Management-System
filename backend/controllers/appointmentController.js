const Appointment = require("../models/Appointment");
const Department = require("../models/Department");
const User = require("../models/User");

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getDoctorsByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { role: "doctor" };
    if (department) filter.department = department;

    const doctors = await User.find(filter).select(
      "fullName specialization department _id"
    );

    const formatted = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.fullName,
      specialization: doc.specialization || "",
    }));

    res.status(200).json({ success: true, doctors: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, department, date, timeSlot, reason, type } = req.body;

    if (!doctorId || !department || !date || !timeSlot || !reason) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      department,
      date,
      timeSlot,
      reason,
      type: type || "in-person",
    });

    res.status(201).json({ success: true, message: "Appointment requested", appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "fullName")
      .sort({ createdAt: -1 });

    const formatted = appointments.map((a) => ({
      _id: a._id,
      doctorId: a.doctor?._id, 
      doctorName: a.doctor?.fullName || "Doctor",
      department: a.department,
      date: a.date,
      timeSlot: a.timeSlot,
      reason: a.reason,
      type: a.type,
      status: a.status,
    }));

    res.status(200).json({ success: true, appointments: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "doctor",
      "fullName"
    );

    if (!appointment) {
      return res.status(404).json({ success: false, error: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      appointment: {
        _id: appointment._id,
        doctorName: appointment.doctor?.fullName || "Doctor",
        department: appointment.department,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        reason: appointment.reason,
        type: appointment.type,
        status: appointment.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, error: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};