import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaFileMedical,
} from "react-icons/fa";
import { getPatientDetails } from "../../services/doctorAppointmentService";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPatientDetails(id)
      .then((data) => setPatient(data.patient))
      .catch(() => setError("Could not load patient details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/doctor/patients"
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-4"
      >
        <FaArrowLeft /> Back to Patient List
      </Link>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {patient && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
              {patient.fullName?.charAt(0) || "P"}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                {patient.fullName}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Patient
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <FaEnvelope className="text-sky-500" />
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {patient.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <FaPhone className="text-sky-500" />
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {patient.phone}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <FaFileMedical /> Visit History
            </h2>
            {(!patient.records || patient.records.length === 0) && (
              <p className="text-sm text-slate-400">No previous records.</p>
            )}
            <div className="space-y-2">
              {(patient.records || []).map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {record.diagnosis}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <FaCalendarAlt /> {record.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PatientDetails;