import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaUpload, FaSpinner, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import {
  uploadLabReport,
  getPatientsForSelect,
} from "../../services/doctorRecordsService";

const UploadReports = () => {
  const [patients, setPatients] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
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
    if (!selectedFile) {
      setServerError("Please select a file to upload.");
      return;
    }
    setServerError("");
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("patientId", formData.patientId);
      payload.append("testName", formData.testName);
      payload.append("file", selectedFile);

      await uploadLabReport(payload);
      setIsSuccess(true);
      reset();
      setSelectedFile(null);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Could not upload report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Upload Lab Reports
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Upload test results for a patient.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
        noValidate
      >
        {isSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
            <FaCheckCircle /> Report uploaded successfully!
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
            Test Name
          </label>
          <input
            type="text"
            placeholder="e.g. Complete Blood Count"
            {...register("testName", { required: true })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Report File
          </label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-8 cursor-pointer hover:border-sky-300 transition-colors">
            <FaUpload className="text-slate-400 text-xl" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {selectedFile ? (
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <FaFileAlt /> {selectedFile.name}
                </span>
              ) : (
                "Click to select a PDF or image file"
              )}
            </span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Uploading...
            </>
          ) : (
            "Upload Report"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadReports;