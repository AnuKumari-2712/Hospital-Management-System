import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaSearch } from "react-icons/fa";
import { getAllAppointments } from "../../services/adminOpsService";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  completed: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllAppointments()
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => setError("Could not load appointments."))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = appointments.filter(
    (a) =>
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Appointment Management
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        All appointments across the hospital.
      </p>

      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search by patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaCalendarCheck className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No appointments found</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-slate-400">
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Doctor</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => (
                <motion.tr
                  key={appt._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <td className="p-4 text-slate-800 dark:text-white">{appt.patientName}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">Dr. {appt.doctorName}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{appt.date}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{appt.timeSlot}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        statusStyles[appt.status] || statusStyles.pending
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;