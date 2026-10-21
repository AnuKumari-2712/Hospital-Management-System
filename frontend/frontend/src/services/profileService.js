import axiosInstance from "./axiosInstance";

/**
 * Fetch logged-in patient's profile
 * Expected backend route: GET /api/v1/patients/profile
 */
export const getProfile = async () => {
  const { data } = await axiosInstance.get("/patients/profile");
  return data;
};

/**
 * Update patient profile
 * Expected backend route: PATCH /api/v1/patients/profile
 */
export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.patch("/patients/profile", profileData);
  return data;
};

/**
 * Upload/update profile picture
 * Expected backend route: POST /api/v1/patients/profile/avatar
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await axiosInstance.post(
    "/patients/profile/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

/**
 * Change password (while logged in)
 * Expected backend route: PATCH /api/v1/patients/change-password
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await axiosInstance.patch("/patients/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};