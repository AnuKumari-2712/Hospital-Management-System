import { motion } from "framer-motion";
import { FaUserInjured, FaUserMd, FaUserShield } from "react-icons/fa";

const roles = [
  { value: "patient", label: "Patient", icon: FaUserInjured },
  { value: "doctor", label: "Doctor", icon: FaUserMd },
  { value: "admin", label: "Admin", icon: FaUserShield },
];

const RoleSelector = ({ selectedRole, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Login As
      </label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map(({ value, label, icon: Icon }) => {
          const isActive = selectedRole === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={`relative flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all text-xs font-medium ${
                isActive
                  ? "border-sky-400 text-sky-600 dark:text-sky-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="role-highlight"
                  className="absolute inset-0 bg-sky-50 dark:bg-sky-500/10 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="text-base" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;