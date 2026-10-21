import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFlask, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { getLabReports, downloadLabReport } from "../../services/recordsService";

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    getLabReports()
      .then((data) => setReports(data.reports || []))
      .catch(() => setError("Could not load lab reports."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownload = async (id, fileName) => {
    setDownloadingId(id);
    try {
      const blob = await downloadLabReport(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "lab-report.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Could not download report. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Lab Reports
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        View and download your test results.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!isLoading && reports.length === 0 && !error && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaFlask className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No lab reports yet
          </p>
        </div>
      )}

      {reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report, i) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <FaFlask className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    {report.testName || "Lab Test"}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <FaCalendarAlt /> {report.date}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(report._id, report.fileName)}
                disabled={downloadingId === report._id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors disabled:opacity-60 shrink-0"
              >
                <FaDownload className="text-xs" />
                {downloadingId === report._id ? "..." : "Download"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabReports;