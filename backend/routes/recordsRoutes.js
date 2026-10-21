const express = require("express");
const router = express.Router();
const {
  getMyMedicalRecords,
  getMedicalRecordById,
  getMyPrescriptions,
  getMyLabReports,
  downloadLabReport,
} = require("../controllers/recordsController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/medical-records/my", protect(["patient"]), getMyMedicalRecords);
router.get("/medical-records/:id", protect(["patient", "doctor"]), getMedicalRecordById);
router.get("/prescriptions/my", protect(["patient"]), getMyPrescriptions);
router.get("/lab-reports/my", protect(["patient"]), getMyLabReports);
router.get("/lab-reports/:id/download", protect(["patient"]), downloadLabReport);

module.exports = router;