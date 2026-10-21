import axiosInstance from "./axiosInstance";

/**
 * Fetch doctor's weekly schedule
 * Expected backend route: GET /api/v1/doctor/schedule
 */
export const getSchedule = async () => {
  const { data } = await axiosInstance.get("/doctor/schedule");
  return data;
};

/**
 * Update doctor's weekly schedule
 * Expected backend route: PUT /api/v1/doctor/schedule
 */
export const updateSchedule = async (scheduleData) => {
  const { data } = await axiosInstance.put("/doctor/schedule", scheduleData);
  return data;
};

/**
 * Fetch doctor's leave requests
 * Expected backend route: GET /api/v1/doctor/leaves
 */
export const getLeaves = async () => {
  const { data } = await axiosInstance.get("/doctor/leaves");
  return data;
};

/**
 * Request new leave
 * Expected backend route: POST /api/v1/doctor/leaves
 */
export const requestLeave = async (leaveData) => {
  const { data } = await axiosInstance.post("/doctor/leaves", leaveData);
  return data;
};