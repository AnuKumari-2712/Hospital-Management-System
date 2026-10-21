import axiosInstance from "./axiosInstance";

export const getBills = async () => {
  const { data } = await axiosInstance.get("/billing/my");
  return data;
};

export const getBillById = async (id) => {
  const { data } = await axiosInstance.get(`/billing/${id}`);
  return data;
};

export const initiatePayment = async (id) => {
  const { data } = await axiosInstance.post(`/billing/${id}/pay`);
  return data;
};

/**
 * Verify payment after Razorpay checkout success
 * Expected backend route: POST /api/v1/billing/:id/verify
 */
export const verifyPayment = async (id, paymentData) => {
  const { data } = await axiosInstance.post(`/billing/${id}/verify`, paymentData);
  return data;
};

export const getPaymentHistory = async () => {
  const { data } = await axiosInstance.get("/billing/payment-history");
  return data;
};