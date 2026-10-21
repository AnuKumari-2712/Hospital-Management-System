import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "../../components/auth/RegisterForm";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FaHospitalSymbol } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500 relative overflow-hidden">
      {/* Theme Toggle - top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Decorative blurred blobs */}
      <div className="hidden sm:block absolute -top-24 -left-24 w-72 h-72 bg-sky-300/40 dark:bg-sky-500/10 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300/40 dark:bg-emerald-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[380px] sm:max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/50 shadow-2xl shadow-slate-300/30 dark:shadow-black/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/30 mb-3 sm:mb-4">
              <FaHospitalSymbol className="text-white text-2xl sm:text-3xl" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight text-center">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
              Join MediCare+ Hospital today
            </p>
          </div>

          <RegisterForm navigate={navigate} />

          <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-5 sm:mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;