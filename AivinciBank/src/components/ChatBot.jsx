"use client";

import { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Salam! Mən Aivinci Bankın AI köməkçisiyəm. Sizə necə kömək edə bilərəm?",
      isBot: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chat when clicking outside
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

    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      isBot: false,
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate bot response with typing indicator
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Təşəkkür edirəm! Sorğunuzu qəbul etdim. Sizə daha ətraflı məlumat vermək üçün bankın mütəxəssisi tezliklə sizinlə əlaqə saxlayacaq.",
        isBot: true,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 2000);
  };

  // Custom SVG icons
  const icons = {
    chat: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    close: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6L18 18"
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
    mic: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 19V23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 23H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    image: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 15L16 10L5 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    paperclip: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42925 14.0991 2.00049 15.16 2.00049C16.2209 2.00049 17.2394 2.42925 17.99 3.18C18.7408 3.93063 19.1695 4.94905 19.1695 6.01C19.1695 7.07095 18.7408 8.08938 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    smile: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 9H9.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9H15.01"
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
      <button
        className={`fixed right-6 bottom-6 z-40 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 cursor-pointer ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } bg-lime-500 hover-lift text-white`}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        {icons.chat}
      </button>

      <div
        ref={chatRef}
        className={`fixed right-6 bottom-6 z-50 w-80 sm:w-96 rounded-3xl shadow-xl transition-all duration-500 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }}
      >
        <div className="bg-[#0c0c0c] p-5 flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <h3 className="font-medium text-white display-font">
                Aivinci AI Köməkçi
              </h3>
              <p className="text-xs text-white/70">24/7 xidmətinizdə</p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="w-8 h-8 rounded-3xl flex items-center justify-center transition-all cursor-pointer text-amber-50"
            aria-label="Close chat"
          >
            {icons.close}
          </button>
        </div>

        <div className="h-80 overflow-y-auto p-5 flex flex-col space-y-4 bg-surface">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] p-4 rounded-3xl ${
                message.isBot
                  ? "bg-surface-hover border border-surface-hover self-start"
                  : "bg-lime-600 text-white self-end"
              }`}
              style={{
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                animation: "fadeIn 0.3s ease-out forwards",
              }}
            >
              {message.text}
            </div>
          ))}

          {isTyping && (
            <div className="max-w-[80%] p-4 rounded-3xl bg-surface-hover border border-surface-hover self-start">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-lime-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-surface-hover bg-surface">
          <div className="flex space-x-2 mb-3">
            <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary/10 transition-colors text-amber-50">
              {icons.smile}
            </button>
            <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary/10 transition-colors text-amber-50">
              {icons.paperclip}
            </button>
            <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary/10 transition-colors text-amber-50">
              {icons.image}
            </button>
            <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary/10 transition-colors text-amber-50">
              {icons.mic}
            </button>
          </div>

          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full py-3 px-4 pr-12 rounded-full bg-surface-hover border border-surface-hover focus:outline-none focus:border-primary transition-colors placeholder:text-amber-50"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-amber-600 hover:bg-primary/90 text-white"
            >
              {icons.send}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
