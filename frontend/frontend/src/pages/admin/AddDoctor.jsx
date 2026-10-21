import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { doctorSchema } from "../../schemas/doctorSchema";
import { addDoctor } from "../../services/adminDoctorService";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(doctorSchema) });

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await addDoctor(formData);
      navigate("/admin/doctors");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Could not add doctor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Link
        to="/admin/doctors"
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-4"
      >
        <FaArrowLeft /> Back to Manage Doctors
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Add Doctor
      </h1>

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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
          <input
            type="text"
            {...register("fullName")}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${errors.fullName ? "border-red-400" : "border-slate-200 dark:border-slate-700"} text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${errors.email ? "border-red-400" : "border-slate-200 dark:border-slate-700"} text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${errors.phone ? "border-red-400" : "border-slate-200 dark:border-slate-700"} text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
          <input
            type="password"
            {...register("password")}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${errors.password ? "border-red-400" : "border-slate-200 dark:border-slate-700"} text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Specialization</label>
          <input
            type="text"
            placeholder="e.g. Cardiologist"
            {...register("specialization")}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${errors.specialization ? "border-red-400" : "border-slate-200 dark:border-slate-700"} text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300`}
          />
          {errors.specialization && <p className="text-red-500 text-xs mt-1.5">{errors.specialization.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
          <input
            type="text"
            placeholder="e.g. Cardiology"
            {...register("department")}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${errors.department ? "border-red-400" : "border-slate-200 dark:border-slate-700"} text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300`}
          />
          {errors.department && <p className="text-red-500 text-xs mt-1.5">{errors.department.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Adding...
            </>
          ) : (
            "Add Doctor"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;