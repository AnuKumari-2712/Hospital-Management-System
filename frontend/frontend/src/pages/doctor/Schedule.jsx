import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClock, FaSave, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { getSchedule, updateSchedule } from "../../services/doctorScheduleService";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Schedule = () => {
  const [schedule, setSchedule] = useState(
    days.map((day) => ({ day, isAvailable: false, startTime: "09:00", endTime: "17:00" }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSchedule()
      .then((data) => {
        if (data.schedule && data.schedule.length > 0) {
          setSchedule(data.schedule);
        }
      })
      .catch(() => setError("Could not load schedule. Showing default."))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleDay = (index) => {
    setSchedule((prev) =>
      prev.map((s, i) => (i === index ? { ...s, isAvailable: !s.isAvailable } : s))
    );
  };

  const updateTime = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      await updateSchedule({ schedule });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch {
      setError("Could not save schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Weekly Schedule
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Set your availability for each day of the week.
      </p>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm rounded-xl px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
        {schedule.map((s, i) => (
          <motion.div
            key={s.day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-4 sm:p-5 flex-wrap gap-3"
          >
            <label className="flex items-center gap-3 min-w-[110px] cursor-pointer">
              <input
                type="checkbox"
                checked={s.isAvailable}
                onChange={() => toggleDay(i)}
                className="w-4 h-4 rounded accent-sky-500"
              />
              <span className="text-sm font-medium text-slate-800 dark:text-white">
                {s.day}
              </span>
            </label>

            {s.isAvailable && (
              <div className="flex items-center gap-2">
                <FaClock className="text-slate-400 text-sm" />
                <input
                  type="time"
                  value={s.startTime}
                  onChange={(e) => updateTime(i, "startTime", e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
                />
                <span className="text-slate-400 text-sm">to</span>
                <input
                  type="time"
                  value={s.endTime}
                  onChange={(e) => updateTime(i, "endTime", e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70"
      >
        {isSaving ? (
          <>
            <FaSpinner className="animate-spin" /> Saving...
          </>
        ) : isSuccess ? (
          <>
            <FaCheckCircle /> Saved!
          </>
        ) : (
          <>
            <FaSave /> Save Schedule
          </>
        )}
      </button>
    </div>
  );
};

export default Schedule;