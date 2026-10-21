import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaReceipt, FaCalendarAlt } from "react-icons/fa";
import { getPaymentHistory } from "../../services/billingService";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPaymentHistory()
      .then((data) => setPayments(data.payments || []))
      .catch(() => setError("Could not load payment history."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <Link
        to="/patient/billing"
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-4"
      >
        <FaArrowLeft /> Back to Billing
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Payment History
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Record of all your past payments.
      </p>

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
          <FaReceipt className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No payment history yet
          </p>
        </div>
      )}

      {!isLoading && !error && payments.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
          {payments.map((payment, i) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center justify-between p-4 sm:p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shrink-0">
                  <FaReceipt className="text-white text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white truncate">
                    {payment.description || "Payment"}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <FaCalendarAlt /> {payment.date}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-slate-800 dark:text-white">
                  ₹{payment.amount || 0}
                </p>
                <p className="text-xs text-emerald-500">
                  {payment.transactionId ? `#${payment.transactionId.slice(-8)}` : "Paid"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;