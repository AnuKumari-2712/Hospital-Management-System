import axiosInstance from "./axiosInstance";

export const getAllDoctors = async () => {
  const { data } = await axiosInstance.get("/admin/doctors");
  return data;
};

export const getDoctorById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/doctors/${id}`);
  return data;
};

export const addDoctor = async (doctorData) => {
  const { data } = await axiosInstance.post("/admin/doctors", doctorData);
  return data;
};

export const updateDoctor = async (id, doctorData) => {
  const { data } = await axiosInstance.patch(`/admin/doctors/${id}`, doctorData);
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/doctors/${id}`);
  return data;
};

export const getAllPatients = async () => {
  const { data } = await axiosInstance.get("/admin/patients");
  return data;
};

export const getAdminPatientDetails = async (id) => {
  const { data } = await axiosInstance.get(`/admin/patients/${id}`);
  return data;
};

/**
 * Bulk upload doctors via CSV file
 * Expected backend route: POST /api/v1/admin/doctors/bulk-upload
 */
export const bulkUploadDoctors = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/admin/doctors/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};