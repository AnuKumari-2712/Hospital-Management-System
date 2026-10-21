import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaFileMedical,
  FaArrowLeft,
  FaTimesCircle,
} from "react-icons/fa";
import {
  getAppointmentById,
  cancelAppointment,
} from "../../services/appointmentService";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    getAppointmentById(id)
      .then((data) => setAppointment(data.appointment))
      .catch(() => setError("Could not load appointment details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelAppointment(id);
      navigate("/patient/appointments");
    } catch {
      setError("Could not cancel appointment. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          to="/patient/appointments"
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-4"
        >
          <FaArrowLeft /> Back to Appointments
        </Link>
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/patient/appointments"
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-4"
      >
        <FaArrowLeft /> Back to Appointments
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
            <FaUserMd className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              Dr. {appointment?.doctorName || "Doctor"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {appointment?.department || "General"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <FaCalendarAlt className="text-sky-500" />
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {appointment?.date || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <FaClock className="text-sky-500" />
            <div>
              <p className="text-xs text-slate-400">Time</p>
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {appointment?.timeSlot || "—"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
            <FaFileMedical /> Reason for Visit
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            {appointment?.reason || "No reason provided."}
          </p>
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          {appointment?.status || "pending"}
        </span>

        {appointment?.status !== "cancelled" &&
          appointment?.status !== "completed" && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="flex items-center gap-2 text-red-500 text-sm font-medium hover:underline disabled:opacity-60"
            >
              <FaTimesCircle />
              {isCancelling ? "Cancelling..." : "Cancel Appointment"}
            </button>
          )}
      </motion.div>
    </div>
  );
};

export default AppointmentDetails;