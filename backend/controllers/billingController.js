const Bill = require("../models/Bill");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getMyBills = async (req, res, next) => {
  try {
    const bills = await Bill.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bills });
  } catch (error) {
    next(error);
  }
};

exports.getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      res.statusCode = 404;
      return next(new Error("Bill not found."));
    }
    if (bill.patient.toString() !== req.user.id) {
      res.statusCode = 403;
      return next(new Error("Not authorized."));
    }
    res.status(200).json({ success: true, bill });
  } catch (error) {
    next(error);
  }
};

exports.initiatePayment = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      res.statusCode = 404;
      return next(new Error("Bill not found."));
    }
    if (bill.status === "paid") {
      res.statusCode = 400;
      return next(new Error("Bill already paid."));
    }

    const order = await razorpay.orders.create({
      amount: bill.amount * 100,
      currency: "INR",
      receipt: `receipt_${bill._id}`,
    });

    bill.razorpayOrderId = order.id;
    await bill.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      billDescription: bill.description,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/billing/:id/verify  (called after Razorpay checkout success)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.statusCode = 400;
      return next(new Error("Missing payment verification details."));
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      res.statusCode = 404;
      return next(new Error("Bill not found."));
    }

    // Verify the signature to confirm the payment is genuine
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      res.statusCode = 400;
      return next(new Error("Payment verification failed. Signature mismatch."));
    }

    bill.status = "paid";
    bill.transactionId = razorpay_payment_id;
    bill.paidAt = new Date();
    await bill.save();

    res.status(200).json({ success: true, message: "Payment verified and bill marked as paid." });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Bill.find({ patient: req.user.id, status: "paid" }).sort({ paidAt: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};