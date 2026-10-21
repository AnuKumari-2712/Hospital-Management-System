import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSave, FaSpinner, FaCheckCircle, FaLock, FaMoon } from "react-icons/fa";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { changePassword } from "../../services/profileService";

const AdminSettings = () => {
  const [isPwSaving, setIsPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const { register, handleSubmit, reset } = useForm();

  const onSubmitPassword = async (formData) => {
    setIsPwSaving(true);
    setPwError("");
    try {
      await changePassword(formData);
      setPwSuccess(true);
      reset();
      setTimeout(() => setPwSuccess(false), 1500);
    } catch (err) {
      setPwError(err?.response?.data?.message || "Could not change password.");
    } finally {
      setIsPwSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <FaMoon className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
        </div>
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleSubmit(onSubmitPassword)}
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
          {...register("currentPassword", { required: true })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
        <input
          type="password"
          placeholder="New password"
          {...register("newPassword", { required: true })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          type="submit"
          disabled={isPwSaving}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
        >
          {isPwSaving ? <FaSpinner className="animate-spin" /> : <><FaSave className="text-xs" /> Update Password</>}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;