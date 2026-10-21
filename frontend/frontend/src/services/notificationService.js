import axiosInstance from "./axiosInstance";

/**
 * Fetch patient's notifications
 * Expected backend route: GET /api/v1/notifications
 */
export const getNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications");
  return data;
};

/**
 * Mark a notification as read
 * Expected backend route: PATCH /api/v1/notifications/:id/read
 */
export const markAsRead = async (id) => {
  const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
  return data;
};