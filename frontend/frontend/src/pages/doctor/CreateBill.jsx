import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaFileInvoiceDollar, FaSpinner, FaCheckCircle } from "react-icons/fa";
import {
  createBill,
  getPatientsForSelect,
} from "../../services/doctorRecordsService";

const CreateBill = () => {
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getPatientsForSelect()
      .then((data) => setPatients(data.patients || []))
      .catch(() => setPatients([]));
  }, []);

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await createBill({ ...formData, amount: Number(formData.amount) });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Could not create bill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Create Bill
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Generate a bill for a patient's consultation or treatment.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
        noValidate
      >
        {isSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
            <FaCheckCircle /> Bill created successfully!
          </div>
        )}
        {serverError && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Patient
          </label>
          <select
            {...register("patientId", { required: true })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <input
            type="text"
            placeholder="e.g. Consultation fee, Lab test charges"
            {...register("description", { required: true })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Amount (₹)
          </label>
          <input
            type="number"
            placeholder="500"
            {...register("amount", { required: true })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Creating...
            </>
          ) : (
            <>
              <FaFileInvoiceDollar className="text-sm" /> Create Bill
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateBill;