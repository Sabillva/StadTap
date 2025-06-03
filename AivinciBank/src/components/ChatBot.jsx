"use client";

import { useTheme } from "./ThemeContext";
import { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const { darkMode } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const languages = {
    az: {
      name: "Azərbaycan",
      flag: "🇦🇿",
      welcome:
        "Salam! Mən Aivinci Bankın AI köməkçisiyəm. Sizə necə kömək edə bilərəm?",
      placeholder: "Mesajınızı yazın...",
      response:
        "Təşəkkür edirəm! Sorğunuzu qəbul etdim. Sizə daha ətraflı məlumat vermək üçün bankın mütəxəssisi tezliklə sizinlə əlaqə saxlayacaq.",
    },
    ru: {
      name: "Русский",
      flag: "🇷🇺",
      welcome: "Привет! Я AI-помощник банка Aivinci. Как я могу вам помочь?",
      placeholder: "Напишите ваше сообщение...",
      response:
        "Спасибо! Я принял ваш запрос. Специалист банка свяжется с вами в ближайшее время для предоставления подробной информации.",
    },
    en: {
      name: "English",
      flag: "🇺🇸",
      welcome: "Hello! I'm Aivinci Bank's AI assistant. How can I help you?",
      placeholder: "Type your message...",
      response:
        "Thank you! I have received your request. A bank specialist will contact you shortly to provide detailed information.",
    },
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageSelector(false);
    setMessages([
      {
        id: 1,
        text: languages[lang].welcome,
        isBot: true,
      },
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "" || !selectedLanguage) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      isBot: false,
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: languages[selectedLanguage].response,
        isBot: true,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 2000);
  };

  const resetChat = () => {
    setSelectedLanguage(null);
    setShowLanguageSelector(true);
    setMessages([]);
    setNewMessage("");
  };

  // Modern minimalist icons
  const icons = {
    ai: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 1v6m0 8v6M4.22 4.22l4.24 4.24m7.07 7.07l4.24 4.24M1 12h6m8 0h6M4.22 19.78l4.24-4.24m7.07-7.07l4.24-4.24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    close: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    send: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    brain: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 14.5 2h-5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
    reset: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 16H3v5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <>
      {/* Modern AI Chat Button */}
      <button
        className={`fixed right-6 bottom-6 z-40 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={toggleChat}
        aria-label="Open AI Chat"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #f59e0b 0%, #14b8a6 50%, #84cc16 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #06b6d4 50%, #65a30d 100%)",
          boxShadow: darkMode
            ? "0 10px 30px rgba(245, 158, 11, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)"
            : "0 10px 30px rgba(251, 191, 36, 0.3), 0 0 20px rgba(6, 182, 212, 0.2)",
        }}
      >
        <div className="relative text-white group-hover:scale-110 transition-transform duration-300">
          {icons.ai}
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute w-full h-full opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(132, 204, 22, 0.3) 0%, transparent 50%)
              `,
            }}
          ></div>
        </div>
      </button>

      {/* Chat Interface */}
      <div
        ref={chatRef}
        className={`fixed right-6 bottom-6 z-50 w-80 sm:w-96 rounded-3xl transition-all duration-500 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{
          background: darkMode
            ? "rgba(15, 15, 15, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: darkMode
            ? "1px solid rgba(245, 158, 11, 0.2)"
            : "1px solid rgba(20, 184, 166, 0.2)",
          boxShadow: darkMode
            ? "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.1)"
            : "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(20, 184, 166, 0.1)",
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex justify-between items-center relative overflow-hidden rounded-t-3xl"
          style={{
            background: darkMode
              ? "linear-gradient(135deg, #f59e0b 0%, #14b8a6 50%, #84cc16 100%)"
              : "linear-gradient(135deg, #fbbf24 0%, #06b6d4 50%, #65a30d 100%)",
          }}
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="flex items-center space-x-3 relative z-10">
            <div>
              <h3 className="font-bold text-white text-lg">Aivinci AI</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></div>
                <p className="text-xs text-white/90 font-medium">
                  Online • Smart Assistant
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 relative z-10">
            {selectedLanguage && (
              <button
                onClick={resetChat}
                className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white border border-white/30 hover:scale-110"
                title="Reset Chat"
              >
                {icons.reset}
              </button>
            )}
            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white border border-white/30 hover:scale-110"
              aria-label="Close chat"
            >
              {icons.close}
            </button>
          </div>
        </div>

        {/* Language Selector */}
        {showLanguageSelector && (
          <div className="p-6 text-center">
            <div className="mb-10">
              <div className="mt-6"></div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Choose Your Language
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-dark"
                }`}
              >
                Dilinizi seçin / Выберите язык
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => selectLanguage(code)}
                  className={`w-full p-3 rounded-2xl border-2 transition-all duration-300 hover:scale-101 group ${
                    darkMode
                      ? "border border-[rgba(80,80,80,0.5)] hover:border-amber-400 bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.5)]"
                      : "border-gray-200 hover:border-teal-400 bg-gray-50 hover:bg-teal-50"
                  }`}
                  style={{
                    background: darkMode
                      ? "rgba(40, 40, 40, 0.5)"
                      : "rgba(249, 250, 251, 0.8)",
                  }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {lang.flag}
                    </span>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      {lang.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {!showLanguageSelector && (
          <>
            <div
              className="h-80 overflow-y-auto p-5 space-y-4"
              style={{
                background: darkMode
                  ? "rgba(11, 11, 11, 0.3)"
                  : "rgba(249, 250, 251, 0.5)",
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm ${
                    message.isBot
                      ? `self-start ${
                          darkMode
                            ? "bg-[rgb(36,36,36)]/50 text-white"
                            : "bg-white/70 text-[rgb(36,36,36)]"
                        } border ${
                          darkMode ? "border-[rgb(68,68,68)]/50" : "border-gray-200/50"
                        }`
                      : "self-end text-white"
                  }`}
                  style={{
                    ...(message.isBot
                      ? {}
                      : {
                          background:
                            "linear-gradient(135deg, #f59e0b 0%, #14b8a6 100%)",
                          boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                        }),
                    animation: "slideIn 0.4s ease-out forwards",
                    alignSelf: message.isBot ? "flex-start" : "flex-end",
                  }}
                >
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e0b 0%, #14b8a6 100%)",
                        }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-xs font-medium opacity-70">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              ))}

              {isTyping && (
                <div
                  className={`max-w-[85%] p-4 rounded-2xl self-start ${
                    darkMode ? "bg-[rgb(36,36,36)]/50" : "bg-white/70"
                  } border ${
                    darkMode ? "border-[rgb(68,68,68)]/50" : "border-gray-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #14b8a6 100%)",
                      }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium opacity-70">
                      AI Assistant
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-lime-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="p-4 border-t backdrop-blur-sm rounded-b-3xl"
              style={{
                borderColor: darkMode
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(20, 184, 166, 0.2)",
                background: darkMode
                  ? "rgba(25, 25, 25, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    selectedLanguage
                      ? languages[selectedLanguage].placeholder
                      : "Type your message..."
                  }
                  className={`w-full py-3 px-4 pr-12 rounded-2xl border-2 transition-all duration-300 focus:outline-none backdrop-blur-sm ${
                    darkMode
                      ? "bg-[rgb(36,36,36)]/50 border-[rgb(68,68,68)] focus:border-amber-400 text-white placeholder-[rgb(148,148,148)]"
                      : "bg-white/50 border-gray-200 focus:border-teal-400 text-[rgb(36,36,36)] placeholder-[rgb(56,56,56)]"
                  }`}
                  style={{
                    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #14b8a6 100%)",
                    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  {icons.send}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
