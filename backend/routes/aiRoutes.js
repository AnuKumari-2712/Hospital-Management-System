const express = require("express");
const router = express.Router();
const {
  checkSymptoms,
  chatbotReply,
  summarizeRecord,
} = require("../controllers/aiController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.post("/ai/symptom-checker", protect(["patient"]), checkSymptoms);
router.post("/ai/chatbot", protect(["patient", "doctor", "admin"]), chatbotReply);
router.post("/ai/prescription-summary", protect(["doctor"]), summarizeRecord);

module.exports = router;