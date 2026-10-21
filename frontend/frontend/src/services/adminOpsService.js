import axiosInstance from "./axiosInstance";

/**
 * Departments
 * Expected backend routes: GET/POST /api/v1/admin/departments, DELETE /api/v1/admin/departments/:id
 */
export const getAllDepartments = async () => {
  const { data } = await axiosInstance.get("/admin/departments");
  return data;
};

export const addDepartment = async (departmentData) => {
  const { data } = await axiosInstance.post("/admin/departments", departmentData);
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/departments/${id}`);
  return data;
};

/**
 * Staff (non-doctor hospital staff — nurses, receptionists, etc.)
 * Expected backend routes: GET/POST /api/v1/admin/staff, DELETE /api/v1/admin/staff/:id
 */
export const getAllStaff = async () => {
  const { data } = await axiosInstance.get("/admin/staff");
  return data;
};

export const addStaff = async (staffData) => {
  const { data } = await axiosInstance.post("/admin/staff", staffData);
  return data;
};

export const deleteStaff = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/staff/${id}`);
  return data;
};

/**
 * All appointments hospital-wide (admin oversight)
 * Expected backend route: GET /api/v1/admin/appointments
 */
export const getAllAppointments = async () => {
  const { data } = await axiosInstance.get("/admin/appointments");
  return data;
};