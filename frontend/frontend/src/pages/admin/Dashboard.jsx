import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaArrowRight,
} from "react-icons/fa";

const statCards = [
  { label: "Total Doctors", value: "0", icon: FaUserMd, color: "from-sky-500 to-sky-600", link: "/admin/doctors" },
  { label: "Total Patients", value: "0", icon: FaUsers, color: "from-emerald-500 to-emerald-600", link: "/admin/patients" },
  { label: "Today's Appointments", value: "0", icon: FaCalendarCheck, color: "from-amber-500 to-amber-600", link: "/admin/appointments" },
  { label: "This Month's Revenue", value: "₹0", icon: FaMoneyBillWave, color: "from-rose-500 to-rose-600", link: "/admin/payments" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Admin Overview 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hospital-wide statistics and quick actions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={stat.link} className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="text-white text-lg" />
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/doctors/add" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow">
            Add Doctor <FaArrowRight className="text-xs" />
          </Link>
          <Link to="/admin/departments" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Manage Departments
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;