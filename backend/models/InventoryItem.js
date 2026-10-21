const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);