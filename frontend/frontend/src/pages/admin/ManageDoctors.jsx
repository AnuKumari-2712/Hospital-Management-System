import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileUpload,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getAllDoctors,
  deleteDoctor,
  bulkUploadDoctors,
} from "../../services/adminDoctorService";
import HoverProfileCard from "../../components/ui/HoverProfileCard";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const fetchDoctors = () => {
    setIsLoading(true);
    getAllDoctors()
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => setError("Could not load doctors."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor?")) return;
    setDeletingId(id);
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch {
      setError("Could not delete doctor.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a CSV file first.");
      return;
    }
    setIsUploading(true);
    setUploadError("");
    setUploadResult(null);
    try {
      const res = await bulkUploadDoctors(selectedFile);
      setUploadResult(res.results);
      fetchDoctors();
    } catch (err) {
      setUploadError(err?.response?.data?.message || "Upload failed. Please check your CSV format.");
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadResult(null);
    setUploadError("");
  };

  const filtered = doctors.filter((d) =>
    d.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Manage Doctors
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View, add, edit, or remove doctor accounts. Hover a card for full details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FaFileUpload className="text-xs" /> Bulk Upload
          </button>
          <Link
            to="/admin/doctors/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
          >
            <FaPlus className="text-xs" /> Add Doctor
          </Link>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
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
          <FaUserMd className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No doctors found</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doctor, i) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <HoverProfileCard
                details={{
                  avatarUrl: doctor.avatarUrl,
                  name: `Dr. ${doctor.fullName}`,
                  subtitle: doctor.specialization || "General",
                  fields: [
                    { label: "Email", value: doctor.email },
                    { label: "Phone", value: doctor.phone },
                    { label: "Department", value: doctor.department },
                    { label: "Specialization", value: doctor.specialization },
                  ],
                }}
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-default hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
                      {doctor.avatarUrl ? (
                        <img
                          src={doctor.avatarUrl}
                          alt={doctor.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        doctor.fullName?.charAt(0) || "D"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">
                        Dr. {doctor.fullName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {doctor.specialization || "General"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">{doctor.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate">{doctor.department || "—"}</p>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/doctors/edit/${doctor._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-medium hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      disabled={deletingId === doctor._id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-60"
                    >
                      <FaTrash /> {deletingId === doctor._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </HoverProfileCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Bulk Upload Doctors
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <FaTimes />
                </button>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Upload a CSV file with columns:{" "}
                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  fullName, email, phone, specialization, department, password (optional)
                </code>
              </p>

              {!uploadResult && (
                <>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-8 cursor-pointer hover:border-sky-300 transition-colors mb-4">
                    <FaFileUpload className="text-slate-400 text-xl" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedFile ? selectedFile.name : "Click to select a CSV file"}
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  {uploadError && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2 mb-4">
                      {uploadError}
                    </div>
                  )}

                  <button
                    onClick={handleBulkUpload}
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      "Upload & Import"
                    )}
                  </button>
                </>
              )}

              {uploadResult && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <FaCheckCircle /> Upload complete
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <p>✅ {uploadResult.added.length} doctor(s) added</p>
                    <p>⏭️ {uploadResult.skipped.length} skipped (already exist)</p>
                    <p>❌ {uploadResult.failed.length} failed (missing data)</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDoctors;