import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar, FaHistory } from "react-icons/fa";
import {
  getBills,
  initiatePayment,
  verifyPayment,
} from "../../services/billingService";

const statusStyles = {
  paid: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  overdue: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  const fetchBills = () => {
    setIsLoading(true);
    getBills()
      .then((data) => setBills(data.bills || []))
      .catch(() => setError("Could not load bills."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePay = async (bill) => {
    setPayingId(bill._id);
    setError("");
    try {
      const orderData = await initiatePayment(bill._id);

      if (!window.Razorpay) {
        setError("Payment gateway failed to load. Please refresh and try again.");
        setPayingId(null);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MediCare+ Hospital",
        description: orderData.billDescription || "Medical Bill Payment",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await verifyPayment(bill._id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            fetchBills(); // refresh list to show "paid" status
          } catch {
            setError("Payment succeeded but verification failed. Please contact support.");
          } finally {
            setPayingId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPayingId(null); // user closed the popup without paying
          },
        },
        theme: { color: "#0ea5e9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Could not initiate payment. Please try again.");
      setPayingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Billing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and pay your medical bills.
          </p>
        </div>
        <Link
          to="/patient/payment-history"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <FaHistory className="text-xs" /> Payment History
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && bills.length === 0 && !error && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaFileInvoiceDollar className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No bills yet</p>
        </div>
      )}

      {bills.length > 0 && (
        <div className="space-y-3">
          {bills.map((bill, i) => (
            <motion.div
              key={bill._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shrink-0">
                  <FaFileInvoiceDollar className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    {bill.description || "Medical Bill"}
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                    ₹{bill.amount || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusStyles[bill.status] || statusStyles.pending
                  }`}
                >
                  {bill.status || "pending"}
                </span>
                {bill.status !== "paid" && (
                  <button
                    onClick={() => handlePay(bill)}
                    disabled={payingId === bill._id}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
                  >
                    {payingId === bill._id ? "..." : "Pay Now"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Billing;