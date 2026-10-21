import axiosInstance from "./axiosInstance";

/**
 * Fetch doctor's earnings summary
 * Expected backend route: GET /api/v1/doctor/earnings
 */
export const getEarnings = async () => {
  const { data } = await axiosInstance.get("/doctor/earnings");
  return data;
};

/**
 * Fetch analytics data (appointments over time, patient stats, etc.)
 * Expected backend route: GET /api/v1/doctor/analytics
 */
export const getAnalytics = async () => {
  const { data } = await axiosInstance.get("/doctor/analytics");
  return data;
};

/**
 * Fetch doctor's own profile
 * Expected backend route: GET /api/v1/doctor/profile
 */
export const getDoctorProfile = async () => {
  const { data } = await axiosInstance.get("/doctor/profile");
  return data;
};

/**
 * Update doctor profile
 * Expected backend route: PATCH /api/v1/doctor/profile
 */
export const updateDoctorProfile = async (profileData) => {
  const { data } = await axiosInstance.patch("/doctor/profile", profileData);
  return data;
};