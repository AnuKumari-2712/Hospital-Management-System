import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileMedical, FaPlus, FaSpinner, FaCheckCircle, FaMagic } from "react-icons/fa";
import {
  getDoctorMedicalRecords,
  createMedicalRecord,
  getPatientsForSelect,
} from "../../services/doctorRecordsService";
import { summarizeRecord } from "../../services/aiService";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [aiSummary, setAiSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const diagnosisValue = watch("diagnosis");
  const notesValue = watch("notes");

  useEffect(() => {
    Promise.all([getDoctorMedicalRecords(), getPatientsForSelect()])
      .then(([recordsData, patientsData]) => {
        setRecords(recordsData.records || []);
        setPatients(patientsData.patients || []);
      })
      .catch(() => setServerError("Could not load data."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleGenerateSummary = async () => {
    if (!diagnosisValue) {
      setServerError("Please enter a diagnosis first.");
      return;
    }
    setIsGeneratingSummary(true);
    setAiSummary("");
    try {
      const data = await summarizeRecord(diagnosisValue, notesValue);
      setAiSummary(data.summary);
    } catch {
      setServerError("Could not generate summary. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (aiSummary) payload.notes = `${formData.notes || ""}\n\n[Patient-friendly summary]: ${aiSummary}`.trim();

      const res = await createMedicalRecord(payload);
      setRecords((prev) => [res.record, ...prev]);
      setIsSuccess(true);
      reset();
      setAiSummary("");
      setTimeout(() => {
        setIsSuccess(false);
        setShowForm(false);
      }, 1200);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Could not create record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Medical Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Records you've created for patients.
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
        >
          <FaPlus className="text-xs" /> New Record
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 mb-6 overflow-hidden"
            noValidate
          >
            {isSuccess ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm py-4 justify-center">
                <FaCheckCircle /> Record saved successfully!
              </div>
            ) : (
              <>
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
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    {...register("diagnosis", { required: true })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Clinical Notes
                  </label>
                  <textarea
                    rows={3}
                    {...register("notes")}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline disabled:opacity-60"
                >
                  {isGeneratingSummary ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" /> Generating...
                    </>
                  ) : (
                    <>
                      <FaMagic className="text-xs" /> Generate Patient-Friendly Summary (AI)
                    </>
                  )}
                </button>

                {aiSummary && (
                  <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-xl p-4">
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-1">
                      AI-generated summary (will be added to notes):
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{aiSummary}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : "Save Record"}
                </button>
              </>
            )}
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

      {!isLoading && records.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaFileMedical className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No records created yet
          </p>
        </div>
      )}

      {records.length > 0 && (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <p className="font-semibold text-slate-800 dark:text-white">
                {record.diagnosis}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Patient: {record.patientName || "—"} • {record.date}
              </p>
              {record.notes && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-line">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;