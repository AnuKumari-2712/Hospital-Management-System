import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileMedical, FaCalendarAlt, FaUserMd, FaChevronRight } from "react-icons/fa";
import { getMedicalRecords } from "../../services/recordsService";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMedicalRecords()
      .then((data) => setRecords(data.records || []))
      .catch(() => setError("Could not load medical records."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Medical Records
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Your complete visit and diagnosis history.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && records.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaFileMedical className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No medical records yet
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Records will appear here after your doctor visits.
          </p>
        </div>
      )}

      {!isLoading && !error && records.length > 0 && (
        <div className="space-y-3">
          {records.map((record, i) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={`/patient/medical-records/${record._id}`}
                className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shrink-0">
                    <FaFileMedical className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">
                      {record.diagnosis || "Consultation Record"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <FaUserMd /> Dr. {record.doctorName || "Doctor"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt /> {record.date}
                      </span>
                    </div>
                  </div>
                </div>
                <FaChevronRight className="text-slate-300 dark:text-slate-600 shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;