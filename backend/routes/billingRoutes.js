const express = require("express");
const router = express.Router();
const {
  getMyBills,
  getBillById,
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/billingController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.get("/billing/my", protect(["patient"]), getMyBills);
router.get("/billing/payment-history", protect(["patient"]), getPaymentHistory);
router.get("/billing/:id", protect(["patient"]), getBillById);
router.post("/billing/:id/pay", protect(["patient"]), initiatePayment);
router.post("/billing/:id/verify", protect(["patient"]), verifyPayment);

module.exports = router;