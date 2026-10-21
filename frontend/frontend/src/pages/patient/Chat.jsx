import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaUserMd, FaComments, FaPlus, FaTimes } from "react-icons/fa";
import {
  getConversations,
  getMessages,
  startConversation,
} from "../../services/chatService";
import { getDoctorsByDepartment, getDepartments } from "../../services/appointmentService";
import { connectSocket, getSocket, disconnectSocket } from "../../services/socketService";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(null);

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const socket = connectSocket();

    socket?.on("receive_message", (payload) => {
      setMessages((prev) => {
        if (payload.conversationId !== activeChatRef.current?._id) return prev;
        const isMine = payload.senderId === activeChatRef.current?.myId;
        return [...prev, { ...payload, sender: isMine ? "me" : "other" }];
      });
      fetchConversations();
    });

    socket?.on("user_typing", (data) => {
      if (data.conversationId === activeChatRef.current?._id) setIsTyping(true);
    });

    socket?.on("user_stop_typing", (data) => {
      if (data.conversationId === activeChatRef.current?._id) setIsTyping(false);
    });

    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const fetchConversations = () => {
    getConversations()
      .then((data) => setConversations(data.conversations || []))
      .catch(() => setConversations([]))
      .finally(() => setIsLoadingConvos(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    getMessages(activeChat._id)
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]));
    getSocket()?.emit("join_room", activeChat._id);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openNewChatModal = async () => {
    setShowNewChatModal(true);
    try {
      const deptData = await getDepartments();
      const departments = deptData.departments || [];
      const allDocs = [];
      for (const dept of departments) {
        const docData = await getDoctorsByDepartment(dept.name || dept);
        allDocs.push(...(docData.doctors || []));
      }
      setAllDoctors(allDocs);
    } catch {
      setAllDoctors([]);
    }
  };

  const handleStartChat = async (doctor) => {
    setIsStarting(true);
    try {
      const res = await startConversation(doctor._id);
      const newConvo = {
        _id: res.conversation._id,
        doctorId: doctor._id,
        doctorName: doctor.name,
        lastMessage: "",
      };
      setShowNewChatModal(false);
      fetchConversations();
      setActiveChat(newConvo);
    } catch {
      // silently fail — could show a toast here
    } finally {
      setIsStarting(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const socket = getSocket();
    if (!socket || !activeChat) return;

    socket.emit("typing", { receiverId: activeChat.doctorId, conversationId: activeChat._id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: activeChat.doctorId, conversationId: activeChat._id });
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    const text = input.trim();
    setInput("");

    const socket = getSocket();
    socket?.emit("send_message", {
      conversationId: activeChat._id,
      text,
      receiverId: activeChat.doctorId,
    });

    setMessages((prev) => [
      ...prev,
      { _id: Date.now(), text, sender: "me", createdAt: new Date().toISOString() },
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative">
      <div className="w-full sm:w-72 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-white">Messages</h2>
          <button
            onClick={openNewChatModal}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoadingConvos && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          )}
          {!isLoadingConvos && conversations.length === 0 && (
            <div className="p-6 text-center">
              <FaComments className="text-2xl text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No conversations yet</p>
              <button
                onClick={openNewChatModal}
                className="text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline mt-2"
              >
                Start a new chat
              </button>
            </div>
          )}
          {conversations.map((convo) => (
            <button
              key={convo._id}
              onClick={() => setActiveChat(convo)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeChat?._id === convo._id
                  ? "bg-sky-50 dark:bg-sky-500/10"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                <FaUserMd className="text-white text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  Dr. {convo.doctorName || "Doctor"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {convo.lastMessage || "No messages yet"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex flex-1 flex-col">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <FaUserMd className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">
                  Dr. {activeChat.doctorName || "Doctor"}
                </p>
                {isTyping && <p className="text-xs text-emerald-500">typing...</p>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "me"
                        ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white shrink-0"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 z-10"
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white">Start New Chat</h3>
                <button onClick={() => setShowNewChatModal(false)} className="text-slate-400">
                  <FaTimes />
                </button>
              </div>
              {allDoctors.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">Loading doctors...</p>
              )}
              <div className="space-y-1">
                {allDoctors.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => handleStartChat(doc)}
                    disabled={isStarting}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left disabled:opacity-60"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                      <FaUserMd className="text-white text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        Dr. {doc.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{doc.specialization}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;