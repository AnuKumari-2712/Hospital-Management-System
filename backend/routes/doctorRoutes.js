const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware.js");
const { protect } = require("../middlewares/authMiddleware.js");

const {
  getTodayAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPatients,
  getPatientDetails,
} = require("../controllers/doctorAppointmentController.js");

const {
  getDoctorMedicalRecords,
  createMedicalRecord,
  createPrescription,
  uploadLabReport,
} = require("../controllers/doctorRecordsController.js");

const {
  getSchedule,
  updateSchedule,
  getLeaves,
  requestLeave,
} = require("../controllers/doctorScheduleController.js");

const {
  getEarnings,
  getAnalytics,
  getProfile,
  updateProfile,
} = require("../controllers/doctorProfileController.js");

const { createBill } = require("../controllers/doctorBillingController.js");

// Appointments
router.get("/doctor/appointments/today", protect(["doctor"]), getTodayAppointments);
router.get("/doctor/appointments", protect(["doctor"]), getDoctorAppointments);
router.patch("/doctor/appointments/:id/status", protect(["doctor"]), updateAppointmentStatus);

// Patients
router.get("/doctor/patients", protect(["doctor"]), getDoctorPatients);
router.get("/doctor/patients/:id", protect(["doctor"]), getPatientDetails);

// Records / Prescriptions / Lab Reports
router.get("/doctor/medical-records", protect(["doctor"]), getDoctorMedicalRecords);
router.post("/doctor/medical-records", protect(["doctor"]), createMedicalRecord);
router.post("/doctor/prescriptions", protect(["doctor"]), createPrescription);
router.post(
  "/doctor/lab-reports",
  protect(["doctor"]),
  upload.single("file"),
  uploadLabReport
);

// Schedule / Leave
router.get("/doctor/schedule", protect(["doctor"]), getSchedule);
router.put("/doctor/schedule", protect(["doctor"]), updateSchedule);
router.get("/doctor/leaves", protect(["doctor"]), getLeaves);
router.post("/doctor/leaves", protect(["doctor"]), requestLeave);

// Earnings / Analytics / Profile
router.get("/doctor/earnings", protect(["doctor"]), getEarnings);
router.get("/doctor/analytics", protect(["doctor"]), getAnalytics);
router.get("/doctor/profile", protect(["doctor"]), getProfile);
router.patch("/doctor/profile", protect(["doctor"]), updateProfile);

// Billing
router.post("/doctor/bills", protect(["doctor"]), createBill);

module.exports = router;