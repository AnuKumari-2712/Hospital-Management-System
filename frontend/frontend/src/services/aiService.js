import axiosInstance from "./axiosInstance";

/**
 * Symptom Checker
 * Expected backend route: POST /api/v1/ai/symptom-checker
 */
export const checkSymptoms = async (symptoms) => {
  const { data } = await axiosInstance.post("/ai/symptom-checker", { symptoms });
  return data;
};

/**
 * AI Chatbot
 * Expected backend route: POST /api/v1/ai/chatbot
 */
export const sendChatbotMessage = async (message, history) => {
  const { data } = await axiosInstance.post("/ai/chatbot", { message, history });
  return data;
};

/**
 * Prescription/Record Summary
 * Expected backend route: POST /api/v1/ai/prescription-summary
 */
export const summarizeRecord = async (diagnosis, notes) => {
  const { data } = await axiosInstance.post("/ai/prescription-summary", { diagnosis, notes });
  return data;
};