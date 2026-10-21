import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaHospitalAlt, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import {
  getAllDepartments,
  addDepartment,
  deleteDepartment,
} from "../../services/adminOpsService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getAllDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setError("Could not load departments."))
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await addDepartment(formData);
      setDepartments((prev) => [...prev, res.department]);
      reset();
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    setDeletingId(id);
    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch {
      setError("Could not delete department.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Departments</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
        >
          <FaPlus className="text-xs" /> Add Department
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
              placeholder="Department name (e.g. Cardiology)"
              {...register("name", { required: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
            />
            <textarea
              rows={2}
              placeholder="Short description (optional)"
              {...register("description")}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Add Department"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && departments.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaHospitalAlt className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No departments yet</p>
        </div>
      )}

      {departments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <motion.div
              key={dept._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <FaHospitalAlt className="text-white text-sm" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    {dept.name}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(dept._id)}
                  disabled={deletingId === dept._id}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg shrink-0 disabled:opacity-50"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
              {dept.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                  {dept.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;