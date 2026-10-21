import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { otpSchema } from "../../schemas/otpSchema";
import { verifyOtp, forgotPassword } from "../../services/authService";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FaHospitalSymbol } from "react-icons/fa";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data) => {
    if (!email) {
      setServerError("Session expired. Please start the password reset process again.");
      return;
    }
    setServerError("");
    setIsSubmitting(true);
    try {
      const response = await verifyOtp({ email, otp: data.otp });
      navigate("/reset-password", {
        state: { resetToken: response.resetToken },
      });
    } catch (err) {
      setServerError(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendMessage("");
    try {
      await forgotPassword({ email });
      setResendMessage("A new OTP has been sent to your email.");
    } catch {
      setResendMessage("Could not resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            No email found. Please start the password reset process again.
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
              Enter Verification Code
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
              We sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>
          </div>

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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                6-Digit Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                {...register("otp")}
                className={`w-full text-center tracking-[0.5em] text-xl font-semibold py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
                  errors.otp
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
                } text-slate-800 dark:text-white outline-none focus:ring-2 transition-all`}
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1.5 text-center">{errors.otp.message}</p>
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
                  <FaSpinner className="animate-spin" /> Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </motion.button>

            <div className="text-center text-sm">
              {resendMessage && (
                <p className="text-emerald-600 dark:text-emerald-400 mb-2">{resendMessage}</p>
              )}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sky-600 dark:text-sky-400 font-medium hover:underline disabled:opacity-60"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-5 sm:mt-6 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <FaArrowLeft className="text-xs" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;