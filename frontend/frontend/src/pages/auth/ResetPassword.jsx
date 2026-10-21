import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaSpinner, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPasswordSchema } from "../../schemas/otpSchema";
import { resetPassword } from "../../services/authService";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FaHospitalSymbol } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    if (!resetToken) {
      setServerError("Session expired. Please start the password reset process again.");
      return;
    }
    setServerError("");
    setIsSubmitting(true);
    try {
      await resetPassword({ resetToken, newPassword: data.newPassword });
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            No reset session found. Please start the password reset process again.
          </p>
          <Link to="/forgot-password" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>
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
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
              Enter your new password below.
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <FaCheckCircle className="text-emerald-500 text-2xl" />
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                Password reset successfully!
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Redirecting you to login...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2"
                  >
                    {serverError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("newPassword")}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
                      errors.newPassword
                        ? "border-red-400 focus:ring-red-300"
                        : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
                    } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmNewPassword")}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
                      errors.confirmNewPassword
                        ? "border-red-400 focus:ring-red-300"
                        : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
                    } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.confirmNewPassword.message}</p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;