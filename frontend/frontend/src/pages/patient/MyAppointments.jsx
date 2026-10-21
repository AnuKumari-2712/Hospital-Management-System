import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUserMd, FaChevronRight } from "react-icons/fa";
import { getMyAppointments } from "../../services/appointmentService";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  completed: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyAppointments()
      .then((data) => setAppointments(data.appointments || []))
      .catch(() =>
        setError(
          "Could not load appointments. Make sure you're logged in and the backend is connected."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        My Appointments
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Track your upcoming and past appointments.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && appointments.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaCalendarAlt className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No appointments yet
          </p>
          <Link
            to="/patient/book-appointment"
            className="text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline mt-2 inline-block"
          >
            Book your first appointment
          </Link>
        </div>
      )}

      {!isLoading && !error && appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.map((appt, i) => (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={`/patient/appointments/${appt._id}`}
                className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <FaUserMd className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">
                      Dr. {appt.doctorName || "Doctor"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt /> {appt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock /> {appt.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      statusStyles[appt.status] || statusStyles.pending
                    }`}
                  >
                    {appt.status || "pending"}
                  </span>
                  <FaChevronRight className="text-slate-300 dark:text-slate-600" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;