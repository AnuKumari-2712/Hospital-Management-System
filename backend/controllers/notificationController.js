const Notification = require("../models/Notification");

// GET /api/v1/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// PATCH /api/v1/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
