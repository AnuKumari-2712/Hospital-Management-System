import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaUserCircle, FaComments } from "react-icons/fa";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../../services/chatService";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getConversations()
      .then((data) => setConversations(data.conversations || []))
      .catch(() => setConversations([]))
      .finally(() => setIsLoadingConvos(false));
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    getMessages(activeChat._id)
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]));
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { _id: Date.now(), text, sender: "doctor", createdAt: new Date().toISOString() },
    ]);
    try {
      await sendMessage(activeChat._id, text);
    } catch {
      // Real-time layer (Socket.io) will replace this later
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="w-full sm:w-72 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-white">Messages</h2>
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
                <FaUserCircle className="text-white text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {convo.patientName || "Patient"}
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
                <FaUserCircle className="text-white text-sm" />
              </div>
              <p className="font-medium text-slate-800 dark:text-white">
                {activeChat.patientName || "Patient"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "doctor"
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
                onChange={(e) => setInput(e.target.value)}
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
    </div>
  );
};

export default Chat;