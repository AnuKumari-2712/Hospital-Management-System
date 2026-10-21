import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token automatically if present
axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error response + handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend sends { success, error: "..." } — normalize to also have .message
    // so every form's `err?.response?.data?.message` keeps working.
    if (error.response?.data && !error.response.data.message) {
      error.response.data.message = error.response.data.error;
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;