import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-300 bg-slate-200 dark:bg-slate-700"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center"
        style={{ marginLeft: isDark ? "calc(100% - 1.25rem)" : "0" }}
      >
        {isDark ? (
          <FaMoon className="text-[10px] text-sky-300" />
        ) : (
          <FaSun className="text-[10px] text-amber-500" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;