import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaUmbrellaBeach, FaPlus, FaSpinner } from "react-icons/fa";
import { getLeaves, requestLeave } from "../../services/doctorScheduleService";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  approved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rejected: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getLeaves()
      .then((data) => setLeaves(data.leaves || []))
      .catch(() => setError("Could not load leave requests."))
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await requestLeave(formData);
      setLeaves((prev) => [res.leave, ...prev]);
      reset();
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Leave Management
        </h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
        >
          <FaPlus className="text-xs" /> Request Leave
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 mb-6 overflow-hidden"
            noValidate
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  From
                </label>
                <input
                  type="date"
                  {...register("fromDate", { required: true })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  To
                </label>
                <input
                  type="date"
                  {...register("toDate", { required: true })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Reason
              </label>
              <textarea
                rows={3}
                {...register("reason", { required: true })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Submit Request"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && leaves.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaUmbrellaBeach className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No leave requests yet
          </p>
        </div>
      )}

      {leaves.length > 0 && (
        <div className="space-y-3">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {leave.fromDate} → {leave.toDate}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {leave.reason}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  statusStyles[leave.status] || statusStyles.pending
                }`}
              >
                {leave.status || "pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;