const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} = require("../controllers/chatController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/chat/conversations", protect(["patient", "doctor"]), getConversations);
router.get("/chat/:conversationId/messages", protect(["patient", "doctor"]), getMessages);
router.post("/chat/:conversationId/messages", protect(["patient", "doctor"]), sendMessage);
router.post("/chat/start", protect(["patient"]), startConversation);

module.exports = router;