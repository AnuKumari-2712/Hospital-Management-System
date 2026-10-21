import axiosInstance from "./axiosInstance";

export const getDoctorMedicalRecords = async (patientId) => {
  const { data } = await axiosInstance.get("/doctor/medical-records", {
    params: patientId ? { patientId } : {},
  });
  return data;
};

export const createMedicalRecord = async (recordData) => {
  const { data } = await axiosInstance.post(
    "/doctor/medical-records",
    recordData
  );
  return data;
};

export const createPrescription = async (prescriptionData) => {
  const { data } = await axiosInstance.post(
    "/doctor/prescriptions",
    prescriptionData
  );
  return data;
};

export const uploadLabReport = async (formData) => {
  const { data } = await axiosInstance.post(
    "/doctor/lab-reports",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const getPatientsForSelect = async () => {
  const { data } = await axiosInstance.get("/doctor/patients");
  return data;
};

/**
 * Create a bill for a patient
 * Expected backend route: POST /api/v1/doctor/bills
 */
export const createBill = async (billData) => {
  const { data } = await axiosInstance.post("/doctor/bills", billData);
  return data;
};