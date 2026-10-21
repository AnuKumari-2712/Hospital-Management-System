const Bill = require("../models/Bill");
const InventoryItem = require("../models/InventoryItem");

// GET /api/v1/admin/billing
exports.getAllBills = async (req, res, next) => {
  try {
    const bills = await Bill.find().populate("patient", "fullName").sort({ createdAt: -1 });
    const formatted = bills.map((b) => ({
      _id: b._id,
      patientName: b.patient?.fullName || "Patient",
      description: b.description,
      amount: b.amount,
      status: b.status,
    }));
    res.status(200).json({ success: true, bills: formatted });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Bill.find({ status: "paid" })
      .populate("patient", "fullName")
      .sort({ paidAt: -1 });

    const formatted = payments.map((p) => ({
      _id: p._id,
      patientName: p.patient?.fullName || "Patient",
      amount: p.amount,
      date: p.paidAt,
    }));

    res.status(200).json({ success: true, payments: formatted });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/inventory
exports.getInventory = async (req, res, next) => {
  try {
    const items = await InventoryItem.find().sort({ name: 1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/inventory
exports.addInventoryItem = async (req, res, next) => {
  try {
    const { name, category, quantity } = req.body;
    if (!name || quantity === undefined) {
      res.statusCode = 400;
      return next(new Error("Name and quantity are required."));
    }
    const item = await InventoryItem.create({ name, category: category || "General", quantity });
    res.status(201).json({ success: true, message: "Item added.", item });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admin/inventory/:id
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.statusCode = 404;
      return next(new Error("Item not found."));
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/admin/inventory/:id
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.statusCode = 404;
      return next(new Error("Item not found."));
    }
    res.status(200).json({ success: true, message: "Item removed." });
  } catch (error) {
    next(error);
  }
};