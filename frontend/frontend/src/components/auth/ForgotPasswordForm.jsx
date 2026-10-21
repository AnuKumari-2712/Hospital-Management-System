import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { forgotPasswordSchema } from "../../schemas/forgotPasswordSchema";
import { forgotPassword } from "../../services/authService";

const ForgotPasswordForm = ({ navigate }) => {
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await forgotPassword(data);
      setIsSuccess(true);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Could not send reset instructions. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    // Pass email forward so the OTP page knows which account to verify
    navigate("/verify-otp", { state: { email: getValues("email") } });
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
          <FaCheckCircle className="text-emerald-500 text-2xl" />
        </div>
        <div>
          <p className="text-slate-700 dark:text-slate-200 font-medium">
            Check your email
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            We've sent a verification code to{" "}
            <span className="font-medium">{getValues("email")}</span>
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleContinue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all"
        >
          Enter Verification Code
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center -mt-2 mb-2">
        Enter the email associated with your account and we'll send you a
        code to reset your password.
      </p>

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
          Email Address
        </label>
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
              errors.email
                ? "border-red-400 focus:ring-red-300"
                : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
            } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" /> Sending...
          </>
        ) : (
          "Send Reset Code"
        )}
      </motion.button>
    </form>
  );
};

export default ForgotPasswordForm;