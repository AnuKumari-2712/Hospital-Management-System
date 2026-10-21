import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaFileMedical,
  FaPills,
  FaFileInvoiceDollar,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const statCards = [
  {
    label: "Upcoming Appointments",
    value: "2",
    icon: FaCalendarCheck,
    color: "from-sky-500 to-sky-600",
    link: "/patient/appointments",
  },
  {
    label: "Medical Records",
    value: "8",
    icon: FaFileMedical,
    color: "from-emerald-500 to-emerald-600",
    link: "/patient/medical-records",
  },
  {
    label: "Active Prescriptions",
    value: "3",
    icon: FaPills,
    color: "from-amber-500 to-amber-600",
    link: "/patient/prescriptions",
  },
  {
    label: "Pending Bills",
    value: "1",
    icon: FaFileInvoiceDollar,
    color: "from-rose-500 to-rose-600",
    link: "/patient/billing",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Welcome back 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your health today.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              to={stat.link}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
              >
                <stat.icon className="text-white text-lg" />
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6"
      >
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/patient/book-appointment"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
          >
            Book Appointment <FaArrowRight className="text-xs" />
          </Link>
          <Link
            to="/patient/prescriptions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            View Prescriptions
          </Link>
        </div>
      </motion.div>

      {/* Placeholder note for future data */}
      <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-2xl p-4 text-sm text-sky-700 dark:text-sky-300">
        This dashboard currently shows placeholder numbers. Once connected to
        your backend's appointment/records APIs, these will update with real
        data.
      </div>
    </div>
  );
};

export default Dashboard;