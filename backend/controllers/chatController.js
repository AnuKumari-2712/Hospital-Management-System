const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// GET /api/v1/chat/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "doctor"
        ? { doctor: req.user.id }
        : { patient: req.user.id };

    const conversations = await Conversation.find(filter)
      .populate("patient", "fullName")
      .populate("doctor", "fullName")
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((c) => ({
      _id: c._id,
      patientId: c.patient?._id,
      patientName: c.patient?.fullName || "Patient",
      doctorId: c.doctor?._id,
      doctorName: c.doctor?.fullName || "Doctor",
      lastMessage: c.lastMessage,
    }));

    res.status(200).json({ success: true, conversations: formatted });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/chat/:conversationId/messages
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    }).sort({ createdAt: 1 });

    const formatted = messages.map((m) => ({
      _id: m._id,
      text: m.text,
      sender: m.sender.toString() === req.user.id ? "me" : "other",
      createdAt: m.createdAt,
    }));

    res.status(200).json({ success: true, messages: formatted });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/chat/:conversationId/messages  (REST fallback — Socket.io is primary path)
exports.sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.statusCode = 400;
      return next(new Error("Message text is required."));
    }

    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user.id,
      text,
    });

    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: text,
    });

    res.status(201).json({ success: true, message: { _id: message._id, text: message.text } });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/chat/start  (Patient starts a conversation with a doctor)
exports.startConversation = async (req, res, next) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      res.statusCode = 400;
      return next(new Error("Doctor ID is required."));
    }

    let conversation = await Conversation.findOne({
      patient: req.user.id,
      doctor: doctorId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        patient: req.user.id,
        doctor: doctorId,
      });
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};