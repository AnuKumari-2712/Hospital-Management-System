import axiosInstance from "./axiosInstance";

/**
 * Fetch list of departments
 * Expected backend route: GET /api/v1/departments
 */
export const getDepartments = async () => {
  const { data } = await axiosInstance.get("/departments");
  return data;
};

/**
 * Fetch doctors by department
 * Expected backend route: GET /api/v1/doctors?department=xyz
 */
export const getDoctorsByDepartment = async (department) => {
  const { data } = await axiosInstance.get("/doctors", {
    params: { department },
  });
  return data;
};

/**
 * Book a new appointment
 * Expected backend route: POST /api/v1/appointments
 */
export const bookAppointment = async (appointmentData) => {
  const { data } = await axiosInstance.post("/appointments", appointmentData);
  return data;
};

/**
 * Fetch logged-in patient's appointments
 * Expected backend route: GET /api/v1/appointments/my
 */
export const getMyAppointments = async () => {
  const { data } = await axiosInstance.get("/appointments/my");
  return data;
};

/**
 * Fetch a single appointment by ID
 * Expected backend route: GET /api/v1/appointments/:id
 */
export const getAppointmentById = async (id) => {
  const { data } = await axiosInstance.get(`/appointments/${id}`);
  return data;
};

/**
 * Cancel an appointment
 * Expected backend route: PATCH /api/v1/appointments/:id/cancel
 */
export const cancelAppointment = async (id) => {
  const { data } = await axiosInstance.patch(`/appointments/${id}/cancel`);
  return data;
};