import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCommentDots, FaStar } from "react-icons/fa";
import { getFeedback } from "../../services/adminReportsService";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeedback()
      .then((data) => setFeedbackList(data.feedback || []))
      .catch(() => setError("Could not load feedback."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Feedback</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Patient feedback and ratings.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && feedbackList.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaCommentDots className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No feedback yet</p>
        </div>
      )}

      {feedbackList.length > 0 && (
        <div className="space-y-3">
          {feedbackList.map((fb, i) => (
            <motion.div
              key={fb._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-slate-800 dark:text-white">
                  {fb.patientName || "Patient"}
                </p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-xs ${
                        star <= (fb.rating || 0)
                          ? "text-amber-400"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{fb.comment}</p>
              <p className="text-xs text-slate-400 mt-2">{fb.date}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;