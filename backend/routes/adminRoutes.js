const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploadMiddleware.js");

const {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getAllPatients,
  getAdminPatientDetails,
} = require("../controllers/adminDoctorController.js");

const {
  getAllDepartments,
  addDepartment,
  deleteDepartment,
  getAllStaff,
  addStaff,
  deleteStaff,
  getAllAppointments,
} = require("../controllers/adminOpsController.js");

const {
  getAllBills,
  getAllPayments,
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/adminBillingController.js");

const {
  getAdminAnalytics,
  downloadReport,
  getFeedback,
} = require("../controllers/adminReportsController.js");

const { bulkUploadDoctors } = require("../controllers/adminBulkUploadController.js");

// Doctors
router.get("/admin/doctors", protect(["admin"]), getAllDoctors);
router.get("/admin/doctors/:id", protect(["admin"]), getDoctorById);
router.post("/admin/doctors", protect(["admin"]), addDoctor);
router.patch("/admin/doctors/:id", protect(["admin"]), updateDoctor);
router.delete("/admin/doctors/:id", protect(["admin"]), deleteDoctor);
router.post(
  "/admin/doctors/bulk-upload",
  protect(["admin"]),
  upload.single("file"),
  bulkUploadDoctors
);

// Patients
router.get("/admin/patients", protect(["admin"]), getAllPatients);
router.get("/admin/patients/:id", protect(["admin"]), getAdminPatientDetails);

// Departments
router.get("/admin/departments", protect(["admin"]), getAllDepartments);
router.post("/admin/departments", protect(["admin"]), addDepartment);
router.delete("/admin/departments/:id", protect(["admin"]), deleteDepartment);

// Staff
router.get("/admin/staff", protect(["admin"]), getAllStaff);
router.post("/admin/staff", protect(["admin"]), addStaff);
router.delete("/admin/staff/:id", protect(["admin"]), deleteStaff);

// Appointments (hospital-wide)
router.get("/admin/appointments", protect(["admin"]), getAllAppointments);

// Billing / Payments / Inventory
router.get("/admin/billing", protect(["admin"]), getAllBills);
router.get("/admin/payments", protect(["admin"]), getAllPayments);
router.get("/admin/inventory", protect(["admin"]), getInventory);
router.post("/admin/inventory", protect(["admin"]), addInventoryItem);
router.patch("/admin/inventory/:id", protect(["admin"]), updateInventoryItem);
router.delete("/admin/inventory/:id", protect(["admin"]), deleteInventoryItem);

// Analytics / Reports / Feedback
router.get("/admin/analytics", protect(["admin"]), getAdminAnalytics);
router.get("/admin/reports/:type", protect(["admin"]), downloadReport);
router.get("/admin/feedback", protect(["admin"]), getFeedback);

module.exports = router;