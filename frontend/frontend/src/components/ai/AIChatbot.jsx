import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { sendChatbotMessage } from "../../services/aiService";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your MediCare+ assistant. Ask me anything about our hospital services or general health questions." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, text: m.text }));
      const data = await sendChatbotMessage(userMessage, history);
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/30 flex items-center justify-center text-white"
      >
        {isOpen ? <FaTimes /> : <FaRobot className="text-xl" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 h-[60vh] max-h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-500 to-emerald-500">
              <FaRobot className="text-white" />
              <p className="text-white text-sm font-semibold">MediCare+ Assistant</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-3.5 py-2">
                    <FaSpinner className="animate-spin text-slate-400 text-sm" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white shrink-0 disabled:opacity-60"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;