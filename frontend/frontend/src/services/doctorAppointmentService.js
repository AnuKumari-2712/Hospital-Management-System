import axiosInstance from "./axiosInstance";

/**
 * Fetch today's appointments for the logged-in doctor
 * Expected backend route: GET /api/v1/doctor/appointments/today
 */
export const getTodayAppointments = async () => {
  const { data } = await axiosInstance.get("/doctor/appointments/today");
  return data;
};

/**
 * Fetch all appointments (with optional status filter) for the doctor
 * Expected backend route: GET /api/v1/doctor/appointments?status=xyz
 */
export const getDoctorAppointments = async (status) => {
  const { data } = await axiosInstance.get("/doctor/appointments", {
    params: status ? { status } : {},
  });
  return data;
};

/**
 * Accept or reject a pending appointment
 * Expected backend route: PATCH /api/v1/doctor/appointments/:id/status
 */
export const updateAppointmentStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(
    `/doctor/appointments/${id}/status`,
    { status }
  );
  return data;
};

/**
 * Fetch list of unique patients the doctor has seen
 * Expected backend route: GET /api/v1/doctor/patients
 */
export const getDoctorPatients = async () => {
  const { data } = await axiosInstance.get("/doctor/patients");
  return data;
};

/**
 * Fetch a single patient's details + history
 * Expected backend route: GET /api/v1/doctor/patients/:id
 */
export const getPatientDetails = async (id) => {
  const { data } = await axiosInstance.get(`/doctor/patients/${id}`);
  return data;
};