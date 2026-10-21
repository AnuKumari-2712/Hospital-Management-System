const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/notifications", protect(["patient", "doctor", "admin"]), getNotifications);
router.patch("/notifications/:id/read", protect(["patient", "doctor", "admin"]), markAsRead);

module.exports = router;