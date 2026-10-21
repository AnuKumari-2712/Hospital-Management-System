import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaSave, FaSpinner, FaCheckCircle, FaLock, FaMoon } from "react-icons/fa";
import ThemeToggle from "../../components/ui/ThemeToggle";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../services/doctorProfileService";
import { changePassword } from "../../services/profileService";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [isPwSaving, setIsPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
  } = useForm();

  useEffect(() => {
    getDoctorProfile()
      .then((data) => {
        reset({
          fullName: data.user?.fullName || "",
          phone: data.user?.phone || "",
          specialization: data.user?.specialization || "",
          department: data.user?.department || "",
        });
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmitProfile = async (formData) => {
    setIsSaving(true);
    setError("");
    try {
      await updateDoctorProfile(formData);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitPassword = async (formData) => {
    setIsPwSaving(true);
    setPwError("");
    try {
      await changePassword(formData);
      setPwSuccess(true);
      resetPw();
      setTimeout(() => setPwSuccess(false), 1500);
    } catch (err) {
      setPwError(err?.response?.data?.message || "Could not change password.");
    } finally {
      setIsPwSaving(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-xl mx-auto h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>

      {/* Dark mode */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <FaMoon className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleSubmit(onSubmitProfile)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
        noValidate
      >
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Profile Details
        </h2>
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Specialization</label>
          <input
            type="text"
            {...register("specialization")}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
          <input
            type="text"
            {...register("department")}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
        >
          {isSaving ? <FaSpinner className="animate-spin" /> : isSuccess ? <><FaCheckCircle /> Saved!</> : <><FaSave /> Save Profile</>}
        </button>
      </form>

      {/* Change password form */}
      <form
        onSubmit={handleSubmitPw(onSubmitPassword)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
        noValidate
      >
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FaLock /> Change Password
        </h2>
        {pwError && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">
            {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
            <FaCheckCircle /> Password changed!
          </div>
        )}
        <input
          type="password"
          placeholder="Current password"
          {...registerPw("currentPassword", { required: true })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
        <input
          type="password"
          placeholder="New password"
          {...registerPw("newPassword", { required: true })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          type="submit"
          disabled={isPwSaving}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
        >
          {isPwSaving ? <FaSpinner className="animate-spin" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;