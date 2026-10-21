import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HoverProfileCard = ({ children, details }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                {details.avatarUrl ? (
                  <img src={details.avatarUrl} alt={details.name} className="w-full h-full object-cover" />
                ) : (
                  details.name?.charAt(0) || "?"
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white truncate">
                  {details.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{details.subtitle}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {details.fields.map((field) => (
                <div key={field.label} className="flex justify-between text-xs gap-2">
                  <span className="text-slate-400 shrink-0">{field.label}</span>
                  <span className="text-slate-700 dark:text-slate-300 text-right truncate">
                    {field.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverProfileCard;