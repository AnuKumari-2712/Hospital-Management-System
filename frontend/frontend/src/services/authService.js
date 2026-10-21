import axiosInstance from "./axiosInstance";

/**
 * Calls backend login endpoint.
 * Expected backend route: POST /api/auth/login
 * Expected request body: { email, password, role }
 * Expected response: { token, user: { id, name, email, role } }
 */
export const loginUser = async ({ email, password, role }) => {
  const { data } = await axiosInstance.post("/auth/login", {
    email,
    password,
    role,
  });
  return data;
};

/**
 * Calls backend register endpoint.
 * Expected backend route: POST /api/auth/register
 * Expected request body: { fullName, email, phone, password, role }
 * Expected response: { token, user: { id, name, email, role } }
 */
export const registerUser = async ({
  fullName,
  email,
  phone,
  password,
  role,
}) => {
  const { data } = await axiosInstance.post("/auth/register", {
    fullName,
    email,
    phone,
    password,
    role,
  });
  return data;
};

/**
 * Calls backend forgot-password endpoint.
 * Expected backend route: POST /api/auth/forgot-password
 * Expected request body: { email }
 * Expected response: { message: "OTP sent to your email" }
 */
export const forgotPassword = async ({ email }) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", {
    email,
  });
  return data;
};
/**
 * Verify OTP for password reset
 * Expected backend route: POST /api/v1/auth/verify-otp
 */
export const verifyOtp = async ({ email, otp }) => {
  const { data } = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return data;
};

/**
 * Reset password using the reset token from OTP verification
 * Expected backend route: POST /api/v1/auth/reset-password
 */
export const resetPassword = async ({ resetToken, newPassword }) => {
  const { data } = await axiosInstance.post("/auth/reset-password", {
    resetToken,
    newPassword,
  });
  return data;
};