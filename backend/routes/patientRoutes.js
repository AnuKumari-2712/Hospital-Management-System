const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/patientController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/patients/profile", protect(["patient"]), getProfile);
router.patch("/patients/profile", protect(["patient"]), updateProfile);
router.patch("/patients/change-password", protect(["patient"]), changePassword);

module.exports = router;