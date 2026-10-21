import axiosInstance from "./axiosInstance";

/**
 * Fetch patient's medical records
 * Expected backend route: GET /api/v1/medical-records/my
 */
export const getMedicalRecords = async () => {
  const { data } = await axiosInstance.get("/medical-records/my");
  return data;
};

/**
 * Fetch a single medical record by ID
 * Expected backend route: GET /api/v1/medical-records/:id
 */
export const getMedicalRecordById = async (id) => {
  const { data } = await axiosInstance.get(`/medical-records/${id}`);
  return data;
};

/**
 * Fetch patient's prescriptions
 * Expected backend route: GET /api/v1/prescriptions/my
 */
export const getPrescriptions = async () => {
  const { data } = await axiosInstance.get("/prescriptions/my");
  return data;
};

/**
 * Fetch patient's lab reports
 * Expected backend route: GET /api/v1/lab-reports/my
 */
export const getLabReports = async () => {
  const { data } = await axiosInstance.get("/lab-reports/my");
  return data;
};

/**
 * Download a lab report file
 * Expected backend route: GET /api/v1/lab-reports/:id/download
 */
export const downloadLabReport = async (id) => {
  const response = await axiosInstance.get(`/lab-reports/${id}/download`, {
    responseType: "blob",
  });
  return response.data;
};