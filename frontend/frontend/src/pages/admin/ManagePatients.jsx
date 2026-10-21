import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUsers, FaSearch, FaChevronRight } from "react-icons/fa";
import { getAllPatients } from "../../services/adminDoctorService";
import HoverProfileCard from "../../components/ui/HoverProfileCard";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPatients()
      .then((data) => setPatients(data.patients || []))
      .catch(() => setError("Could not load patients."))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    p.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Manage Patients
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        All registered patients. Hover a row for full details.
      </p>

      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaUsers className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No patients found</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((patient, i) => (
            <motion.div
              key={patient._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <HoverProfileCard
                details={{
                  avatarUrl: patient.avatarUrl,
                  name: patient.fullName,
                  subtitle: "Patient",
                  fields: [
                    { label: "Email", value: patient.email },
                    { label: "Phone", value: patient.phone },
                    { label: "Gender", value: patient.gender },
                    { label: "Address", value: patient.address },
                  ],
                }}
              >
                <Link
                  to={`/admin/patients/${patient._id}`}
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0 overflow-hidden">
                      {patient.avatarUrl ? (
                        <img
                          src={patient.avatarUrl}
                          alt={patient.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {patient.fullName?.charAt(0) || "P"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white truncate">
                        {patient.fullName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{patient.email}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-slate-300 dark:text-slate-600 shrink-0" />
                </Link>
              </HoverProfileCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePatients;