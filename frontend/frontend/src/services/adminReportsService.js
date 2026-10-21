import axiosInstance from "./axiosInstance";

/**
 * Fetch analytics data for hospital-wide reports
 * Expected backend route: GET /api/v1/admin/analytics
 */
export const getAdminAnalytics = async () => {
  const { data } = await axiosInstance.get("/admin/analytics");
  return data;
};

/**
 * Generate and download a PDF report
 * Expected backend route: GET /api/v1/admin/reports/:type
 */
export const downloadReport = async (type) => {
  const response = await axiosInstance.get(`/admin/reports/${type}`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Fetch patient feedback
 * Expected backend route: GET /api/v1/admin/feedback
 */
export const getFeedback = async () => {
  const { data } = await axiosInstance.get("/admin/feedback");
  return data;
};
