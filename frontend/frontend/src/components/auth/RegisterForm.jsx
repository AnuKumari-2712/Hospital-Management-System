import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaSpinner,
} from "react-icons/fa";
import { registerSchema } from "../../schemas/registerSchema";
import RoleSelector from "./RoleSelector";
import { registerUser } from "../../services/authService";

const RegisterForm = ({ navigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "patient",
      agreeTerms: false,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);

      // Redirect based on role (dashboards not built yet, placeholder paths)
      if (response.user.role === "admin") navigate("/admin/dashboard");
      else if (response.user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Register As Role Selector */}
      <RoleSelector
        selectedRole={selectedRole}
        onChange={(role) => setValue("role", role)}
      />

      {/* Server Error */}
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

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="John Doe"
            {...register("fullName")}
            className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
              errors.fullName
                ? "border-red-400 focus:ring-red-300"
                : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
            } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1.5">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
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

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Phone Number
        </label>
        <div className="relative">
          <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="tel"
            placeholder="9876543210"
            {...register("phone")}
            className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
              errors.phone
                ? "border-red-400 focus:ring-red-300"
                : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
            } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
              errors.password
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
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border ${
              errors.confirmPassword
                ? "border-red-400 focus:ring-red-300"
                : "border-slate-200 dark:border-slate-700 focus:ring-sky-300"
            } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            tabIndex={-1}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1.5">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div>
        <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("agreeTerms")}
            className="w-4 h-4 mt-0.5 rounded accent-sky-500"
          />
          <span>
            I agree to the{" "}
            <span className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
              Privacy Policy
            </span>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-red-500 text-xs mt-1.5">
            {errors.agreeTerms.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" /> Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </motion.button>
    </form>
  );
};

export default RegisterForm;