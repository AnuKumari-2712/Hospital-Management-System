import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaBoxes, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../services/adminBillingService";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getInventory()
      .then((data) => setItems(data.items || []))
      .catch(() => setError("Could not load inventory."))
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await addInventoryItem(formData);
      setItems((prev) => [...prev, res.item]);
      reset();
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
    try {
      await updateInventoryItem(id, { quantity });
    } catch {
      setError("Could not update quantity.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from inventory?")) return;
    setDeletingId(id);
    try {
      await deleteInventoryItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      setError("Could not delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
        >
          <FaPlus className="text-xs" /> Add Item
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 mb-6 overflow-hidden"
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="Item name (e.g. Surgical Masks)"
              {...register("name", { required: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Quantity"
                {...register("quantity", { required: true, valueAsNumber: true })}
                className="px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
              />
              <input
                type="text"
                placeholder="Category (e.g. Consumables)"
                {...register("category")}
                className="px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold disabled:opacity-70"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Add Item"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaBoxes className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No inventory items yet</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <FaBoxes className="text-white text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{item.category || "General"}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg shrink-0 disabled:opacity-50"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Qty:</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                  className={`w-20 px-2 py-1.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-sky-300 ${
                    item.quantity < 10
                      ? "border-red-300 text-red-600 dark:text-red-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  } bg-white/70 dark:bg-slate-800/50`}
                />
                {item.quantity < 10 && (
                  <span className="text-xs text-red-500">Low stock</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;