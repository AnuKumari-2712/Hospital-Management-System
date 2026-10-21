import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaEnvelope, FaPhone } from "react-icons/fa";

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Go to 'Book Appointment' from the sidebar, select a department, doctor, date, and time slot, then submit your request.",
  },
  {
    q: "How can I cancel an appointment?",
    a: "Open 'My Appointments', click on the appointment you want to cancel, and use the 'Cancel Appointment' button on the details page.",
  },
  {
    q: "Where can I find my prescriptions?",
    a: "All prescriptions issued by your doctors are available under the 'Prescriptions' section in the sidebar.",
  },
  {
    q: "How do I pay my medical bills?",
    a: "Go to 'Billing', find the bill, and click 'Pay Now' to proceed with payment.",
  },
];

const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Help & Support
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Find answers to common questions or reach out to us.
      </p>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
            <FaEnvelope className="text-white text-sm" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Email us</p>
            <p className="text-sm font-medium text-slate-800 dark:text-white">
              support@medicare.com
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
            <FaPhone className="text-white text-sm" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Call us</p>
            <p className="text-sm font-medium text-slate-800 dark:text-white">
              +91 1800-123-4567
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
            >
              <span className="text-sm font-medium text-slate-800 dark:text-white">
                {faq.q}
              </span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-slate-400 text-xs shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-slate-500 dark:text-slate-400">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSupport;