import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaLock, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { changePasswordSchema } from "../../schemas/profileSchema";
import { changePassword } from "../../services/profileService";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await changePassword(data);
      setIsSuccess(true);
      setTimeout(() => navigate("/patient/settings"), 1500);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Could not change password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link
        to="/patient/settings"
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-4"
      >
        <FaArrowLeft /> Back to Settings
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Change Password
      </h1>

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center"
        >
          <FaCheckCircle className="text-emerald-500 text-3xl mx-auto mb-3" />
          <p className="text-slate-700 dark:text-slate-200 font-medium">
            Password changed successfully!
          </p>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
          noValidate
        >
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
              Current Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="password"
                {...register("currentPassword")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
                  errors.currentPassword ? "border-red-400" : "border-slate-200 dark:border-slate-700"
                } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all`}
              />
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1.5">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="password"
                {...register("newPassword")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
                  errors.newPassword ? "border-red-400" : "border-slate-200 dark:border-slate-700"
                } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all`}
              />
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
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="password"
                {...register("confirmNewPassword")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
                  errors.confirmNewPassword ? "border-red-400" : "border-slate-200 dark:border-slate-700"
                } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all`}
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
                <FaSpinner className="animate-spin" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;