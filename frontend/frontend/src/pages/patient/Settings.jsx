import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaBell,
  FaQuestionCircle,
  FaChevronRight,
  FaMoon,
} from "react-icons/fa";
import ThemeToggle from "../../components/ui/ThemeToggle";

const settingsLinks = [
  { to: "/patient/settings/change-password", label: "Change Password", icon: FaLock },
  { to: "/patient/notifications", label: "Notification Preferences", icon: FaBell },
  { to: "/patient/help", label: "Help & Support", icon: FaQuestionCircle },
];

const Settings = () => {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Settings
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800"
      >
        {/* Dark Mode row */}
        <div className="flex items-center justify-between p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <FaMoon className="text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Dark Mode
            </span>
          </div>
          <ThemeToggle />
        </div>

        {settingsLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </span>
            </div>
            <FaChevronRight className="text-slate-300 dark:text-slate-600 text-xs" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default Settings;