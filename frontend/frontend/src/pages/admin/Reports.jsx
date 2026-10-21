import { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload, FaSpinner } from "react-icons/fa";
import { downloadReport } from "../../services/adminReportsService";

const reportTypes = [
  { key: "appointments", label: "Appointments Report", desc: "All appointments in a date range" },
  { key: "revenue", label: "Revenue Report", desc: "Billing and payment summary" },
  { key: "patients", label: "Patient Report", desc: "Registered patients overview" },
  { key: "doctors", label: "Doctor Activity Report", desc: "Doctor consultation stats" },
];

const Reports = () => {
  const [downloadingKey, setDownloadingKey] = useState(null);
  const [error, setError] = useState("");

  const handleDownload = async (type, label) => {
    setDownloadingKey(type);
    setError("");
    try {
      const blob = await downloadReport(type);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${label.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Could not generate report. Please try again.");
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Reports</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Generate and download hospital reports as PDF.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportTypes.map((report, i) => (
          <motion.div
            key={report.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                <FaFileAlt className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white truncate">
                  {report.label}
                </p>
                <p className="text-xs text-slate-400 truncate">{report.desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(report.key, report.label)}
              disabled={downloadingKey === report.key}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors disabled:opacity-60 shrink-0"
            >
              {downloadingKey === report.key ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaDownload className="text-xs" />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;