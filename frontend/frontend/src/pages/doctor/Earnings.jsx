import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaCalendarAlt } from "react-icons/fa";
import { getEarnings } from "../../services/doctorProfileService";

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEarnings()
      .then((data) => setEarnings(data.earnings))
      .catch(() => setEarnings(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Earnings
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Your consultation earnings overview.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mb-3">
            <FaWallet className="text-white text-sm" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            ₹{earnings?.thisMonth || 0}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This Month</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3">
            <FaWallet className="text-white text-sm" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            ₹{earnings?.totalEarnings || 0}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Earnings</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-3">
            <FaWallet className="text-white text-sm" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            ₹{earnings?.pending || 0}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pending Payout</p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Recent Transactions
        </h2>
        {(!earnings?.transactions || earnings.transactions.length === 0) && (
          <p className="text-sm text-slate-400 text-center py-6">
            No transactions yet
          </p>
        )}
        <div className="space-y-2">
          {(earnings?.transactions || []).map((txn) => (
            <div
              key={txn._id}
              className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {txn.patientName || "Consultation"}
                </p>
                <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <FaCalendarAlt /> {txn.date}
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-500">
                +₹{txn.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;