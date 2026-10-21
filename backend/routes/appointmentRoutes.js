const express = require("express");
const router = express.Router();
const {
  getDepartments,
  getDoctorsByDepartment,
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
} = require("../controllers/appointmentController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/departments", protect(["patient", "doctor", "admin"]), getDepartments);
router.get("/doctors", protect(["patient", "doctor", "admin"]), getDoctorsByDepartment);
router.post("/appointments", protect(["patient"]), bookAppointment);
router.get("/appointments/my", protect(["patient"]), getMyAppointments);
router.get("/appointments/:id", protect(["patient", "doctor", "admin"]), getAppointmentById);
router.patch("/appointments/:id/cancel", protect(["patient"]), cancelAppointment);

module.exports = router;