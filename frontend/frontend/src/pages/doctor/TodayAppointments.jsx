import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserCircle, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  getTodayAppointments,
  updateAppointmentStatus,
} from "../../services/doctorAppointmentService";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getTodayAppointments()
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => setError("Could not load today's appointments."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch {
      setError("Could not update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Today's Appointments
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && appointments.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaClock className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No appointments scheduled for today
          </p>
        </div>
      )}

      {appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.map((appt, i) => (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Link
                  to={`/doctor/patients/${appt.patientId}`}
                  className="flex items-center gap-4 min-w-0"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <FaUserCircle className="text-white text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">
                      {appt.patientName || "Patient"}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <FaClock /> {appt.timeSlot}
                    </span>
                  </div>
                </Link>

                {appt.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStatusUpdate(appt._id, "confirmed")}
                      disabled={updatingId === appt._id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-60"
                    >
                      <FaCheckCircle className="text-xs" /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appt._id, "cancelled")}
                      disabled={updatingId === appt._id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-60"
                    >
                      <FaTimesCircle className="text-xs" /> Decline
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${
                      appt.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {appt.status}
                  </span>
                )}
              </div>
              {appt.reason && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 pl-15">
                  {appt.reason}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;