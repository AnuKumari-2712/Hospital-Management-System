import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaSpinner, FaCheckCircle } from "react-icons/fa";
import {
  createPrescription,
  getPatientsForSelect,
} from "../../services/doctorRecordsService";

const PrescriptionGenerator = () => {
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      patientId: "",
      medicines: [{ name: "", dosage: "", duration: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  useEffect(() => {
    getPatientsForSelect()
      .then((data) => setPatients(data.patients || []))
      .catch(() => setPatients([]));
  }, []);

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await createPrescription(formData);
      setIsSuccess(true);
      reset({ patientId: "", medicines: [{ name: "", dosage: "", duration: "" }] });
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Could not create prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Prescription Generator
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Create a new prescription for a patient.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5"
        noValidate
      >
        {isSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
            <FaCheckCircle /> Prescription created successfully!
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Medicines
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 items-start"
              >
                <input
                  type="text"
                  placeholder="Medicine name"
                  {...register(`medicines.${index}.name`, { required: true })}
                  className="px-3 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-300"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  {...register(`medicines.${index}.dosage`, { required: true })}
                  className="px-3 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-300"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  {...register(`medicines.${index}.duration`)}
                  className="px-3 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-300"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaTrash className="text-sm" />
                </button>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ name: "", dosage: "", duration: "" })}
            className="flex items-center gap-2 mt-3 text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline"
          >
            <FaPlus className="text-xs" /> Add Medicine
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Saving...
            </>
          ) : (
            "Create Prescription"
          )}
        </button>
      </form>
    </div>
  );
};

export default PrescriptionGenerator;