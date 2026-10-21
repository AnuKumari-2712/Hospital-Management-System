const Bill = require("../models/Bill");

// POST /api/v1/doctor/bills
exports.createBill = async (req, res, next) => {
  try {
    const { patientId, description, amount } = req.body;

    if (!patientId || !description || !amount) {
      res.statusCode = 400;
      return next(new Error("Patient, description, and amount are required."));
    }

    const bill = await Bill.create({
      patient: patientId,
      description,
      amount,
    });

    res.status(201).json({ success: true, message: "Bill created.", bill });
  } catch (error) {
    next(error);
  }
};