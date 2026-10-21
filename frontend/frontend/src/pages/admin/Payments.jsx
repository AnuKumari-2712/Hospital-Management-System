import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { getAllPayments } from "../../services/adminBillingService";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPayments()
      .then((data) => setPayments(data.payments || []))
      .catch(() => setError("Could not load payments."))
      .finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Payments</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Completed payment transactions.
      </p>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 max-w-xs">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center mb-3">
          <FaMoneyBillWave className="text-white text-sm" />
        </div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalRevenue}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Revenue</p>
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

      {!isLoading && !error && payments.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaMoneyBillWave className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No payments yet</p>
        </div>
      )}

      {payments.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
          {payments.map((payment, i) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-4 sm:p-5"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-800 dark:text-white truncate">
                  {payment.patientName || "Patient"}
                </p>
                <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <FaCalendarAlt /> {payment.date}
                </span>
              </div>
              <p className="font-bold text-emerald-500 shrink-0">+₹{payment.amount}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;