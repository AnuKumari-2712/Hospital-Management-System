import axiosInstance from "./axiosInstance";

export const getConversations = async () => {
  const { data } = await axiosInstance.get("/chat/conversations");
  return data;
};

export const getMessages = async (conversationId) => {
  const { data } = await axiosInstance.get(
    `/chat/${conversationId}/messages`
  );
  return data;
};

export const sendMessage = async (conversationId, text) => {
  const { data } = await axiosInstance.post(
    `/chat/${conversationId}/messages`,
    { text }
  );
  return data;
};

/**
 * Start a new conversation with a doctor
 * Expected backend route: POST /api/v1/chat/start
 */
export const startConversation = async (doctorId) => {
  const { data } = await axiosInstance.post("/chat/start", { doctorId });
  return data;
};