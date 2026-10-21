import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBell,
  FaCalendarCheck,
  FaFileMedical,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { getNotifications, markAsRead } from "../../services/notificationService";

const iconMap = {
  appointment: FaCalendarCheck,
  record: FaFileMedical,
  billing: FaFileInvoiceDollar,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markAsRead(id);
    } catch {
      // Non-critical — UI already updated optimistically
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Notifications
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Stay updated on your appointments and records.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaBell className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No notifications
          </p>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((n, i) => {
            const Icon = iconMap[n.type] || FaBell;
            return (
              <motion.button
                key={n._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => handleMarkRead(n._id)}
                className={`w-full flex items-start gap-3 text-left p-4 rounded-2xl border transition-colors ${
                  n.isRead
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    : "bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Icon className="text-white text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {n.title || "Notification"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{n.createdAt}</p>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;