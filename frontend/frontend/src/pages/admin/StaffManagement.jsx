import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserTie, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import { getAllStaff, addStaff, deleteStaff } from "../../services/adminOpsService";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getAllStaff()
      .then((data) => setStaff(data.staff || []))
      .catch(() => setError("Could not load staff."))
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await addStaff(formData);
      setStaff((prev) => [...prev, res.staff]);
      reset();
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add staff member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    setDeletingId(id);
    try {
      await deleteStaff(id);
      setStaff((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setError("Could not remove staff member.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Staff Management</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
        >
          <FaPlus className="text-xs" /> Add Staff
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 mb-6 overflow-hidden"
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="Full name"
              {...register("fullName", { required: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="text"
              placeholder="Role (e.g. Nurse, Receptionist)"
              {...register("role", { required: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Add Staff Member"}
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

      {!isLoading && staff.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaUserTie className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No staff members yet</p>
        </div>
      )}

      {staff.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
          {staff.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <FaUserTie className="text-white text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {member.fullName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {member.role} • {member.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(member._id)}
                disabled={deletingId === member._id}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg shrink-0 disabled:opacity-50"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffManagement;