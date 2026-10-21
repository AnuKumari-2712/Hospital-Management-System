import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { loginSchema } from "../../schemas/authSchema";
import RoleSelector from "./RoleSelector";
import { loginUser } from "../../services/authService";

const LoginForm = ({ navigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
      rememberMe: false,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const response = await loginUser(data);

      if (data.rememberMe) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.user.role);
      } else {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("role", response.user.role);
      }

      if (response.user.role === "admin") navigate("/admin/dashboard");
      else if (response.user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <RoleSelector
        selectedRole={selectedRole}
        onChange={(role) => setValue("role", role)}
      />

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
          <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="w-4 h-4 rounded accent-sky-500"
          />
          Remember Me
        </label>
        
        {/* FIXED: Added the missing "<a" tag below */}
        <a 
          href="/forgot-password"
          className="text-sky-600 dark:text-sky-400 font-medium hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" /> Signing in...
          </>
        ) : (
          "Login"
        )}
      </motion.button>
    </form>
  );
};

export default LoginForm;