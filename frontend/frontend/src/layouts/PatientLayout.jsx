import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHospitalSymbol,
  FaTachometerAlt,
  FaCalendarPlus,
  FaCalendarCheck,
  FaFileMedical,
  FaPills,
  FaFlask,
  FaFileInvoiceDollar,
  FaComments,
  FaVideo,
  FaBell,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStethoscope,
} from "react-icons/fa";
import ThemeToggle from "../components/ui/ThemeToggle";
import AIChatbot from "../components/ai/AIChatbot";

const navItems = [
  { to: "/patient/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/patient/symptom-checker", label: "Symptom Checker", icon: FaStethoscope },
  { to: "/patient/book-appointment", label: "Book Appointment", icon: FaCalendarPlus },
  { to: "/patient/appointments", label: "My Appointments", icon: FaCalendarCheck },
  { to: "/patient/medical-records", label: "Medical Records", icon: FaFileMedical },
  { to: "/patient/prescriptions", label: "Prescriptions", icon: FaPills },
  { to: "/patient/lab-reports", label: "Lab Reports", icon: FaFlask },
  { to: "/patient/billing", label: "Billing", icon: FaFileInvoiceDollar },
  { to: "/patient/chat", label: "Chat with Doctor", icon: FaComments },
  { to: "/patient/video-consultation", label: "Video Consultation", icon: FaVideo },
  { to: "/patient/notifications", label: "Notifications", icon: FaBell },
  { to: "/patient/profile", label: "Profile", icon: FaUser },
  { to: "/patient/settings", label: "Settings", icon: FaCog },
  { to: "/patient/help", label: "Help & Support", icon: FaQuestionCircle },
];

const PatientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
            <FaHospitalSymbol className="text-white text-lg" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-sm">
            MediCare<span className="text-sky-500">+</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-500 dark:text-slate-400"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon className="text-base shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors"
          >
            <FaSignOutAlt className="text-base" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600 dark:text-slate-300"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <NavLink to="/patient/notifications" className="relative text-slate-500 dark:text-slate-400">
              <FaBell className="text-lg" />
            </NavLink>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <AIChatbot />
    </div>
  );
};

export default PatientLayout;