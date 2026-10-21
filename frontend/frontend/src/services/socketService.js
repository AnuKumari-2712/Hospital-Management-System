import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) return null;

  if (socket && socket.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};