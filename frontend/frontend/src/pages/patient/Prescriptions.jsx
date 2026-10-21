import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPills, FaUserMd, FaCalendarAlt } from "react-icons/fa";
import { getPrescriptions } from "../../services/recordsService";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPrescriptions()
      .then((data) => setPrescriptions(data.prescriptions || []))
      .catch(() => setError("Could not load prescriptions."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Prescriptions
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Medicines prescribed by your doctors.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && prescriptions.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaPills className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No prescriptions yet
          </p>
        </div>
      )}

      {!isLoading && !error && prescriptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prescriptions.map((presc, i) => (
            <motion.div
              key={presc._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
                  <FaPills className="text-white" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <FaUserMd /> Dr. {presc.doctorName || "Doctor"}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <FaCalendarAlt /> {presc.date}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {(presc.medicines || []).map((med, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-700 dark:text-slate-300 flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 last:border-0"
                  >
                    <span>{med.name}</span>
                    <span className="text-slate-400">{med.dosage}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;