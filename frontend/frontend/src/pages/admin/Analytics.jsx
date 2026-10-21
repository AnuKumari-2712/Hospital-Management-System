import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { getAdminAnalytics } from "../../services/adminReportsService";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((data) => setAnalytics(data.analytics))
      .catch(() => setAnalytics(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const revenueTrend = analytics?.revenueTrend || [];
  const departmentLoad = analytics?.departmentLoad || [];
  const roleDistribution = analytics?.roleDistribution || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Analytics</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Hospital-wide performance and trends.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6"
      >
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Revenue Trend
        </h2>
        {revenueTrend.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">Not enough data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Appointments by Department
          </h2>
          {departmentLoad.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Not enough data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={departmentLoad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
            User Role Distribution
          </h2>
          {roleDistribution.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Not enough data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;