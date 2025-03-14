"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  formatMessageTime,
} from "../utils/chatUtils";

const ChatDetail = () => {
  const { id: recipientId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Load recipient data and messages
  useEffect(() => {
    const loadData = () => {
      // Load recipient data
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundRecipient = storedUsers.find((u) => u.id === recipientId);

      if (!foundRecipient) {
        navigate("/chat");
        return;
      }

      setRecipient(foundRecipient);

      // Load messages
      const conversationMessages = getConversationMessages(
        currentUser.id,
        recipientId
      );
      setMessages(conversationMessages);

      // Mark messages as read
      markMessagesAsRead(currentUser.id, recipientId);

      setLoading(false);
    };

    loadData();

    // Set up interval to refresh messages
    const interval = setInterval(() => {
      const refreshedMessages = getConversationMessages(
        currentUser.id,
        recipientId
      );
      if (JSON.stringify(refreshedMessages) !== JSON.stringify(messages)) {
        setMessages(refreshedMessages);
        markMessagesAsRead(currentUser.id, recipientId);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser.id, recipientId, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // Send message
    const message = sendMessage(currentUser.id, recipientId, newMessage.trim());

    // Update local state
    setMessages([...messages, message]);

    // Clear input
    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <svg
          className="animate-spin h-10 w-10 text-green-400 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-gray-300">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar - Back to conversations */}
          <div className="w-full md:w-1/3 border-r border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <Link to="/chat" className="text-white hover:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
              <h2 className="text-xl font-semibold text-white">Messages</h2>
              <div className="w-5"></div> {/* Spacer for alignment */}
            </div>
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {recipient.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {recipient.firstName} {recipient.lastName}
                  </h3>
                  <p className="text-sm text-gray-400">@{recipient.username}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <Link
                to={`/users/${recipient.id}`}
                className="block w-full text-center bg-[#333] text-white py-2 rounded-full hover:bg-[#444] transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Main Content - Chat */}
          <div className="flex-1 flex flex-col bg-[#222]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {recipient.firstName.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-white">
                  {recipient.firstName} {recipient.lastName}
                </h3>
                <p className="text-xs text-gray-400">@{recipient.username}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Send a message to start the conversation
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    const showTimestamp =
                      index === 0 ||
                      new Date(message.timestamp).toDateString() !==
                        new Date(messages[index - 1].timestamp).toDateString();

                    return (
                      <div key={message.id}>
                        {showTimestamp && (
                          <div className="text-center my-4">
                            <span className="px-2 py-1 bg-[#333] text-gray-400 text-xs rounded-full">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-green-500 text-white rounded-tr-none"
                                : "bg-[#333] text-white rounded-tl-none"
                            }`}
                          >
                            <p>{message.content}</p>
                            <div
                              className={`text-xs mt-1 ${
                                isCurrentUser
                                  ? "text-green-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {formatMessageTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-[#333] border border-gray-600 rounded-l-full text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`px-4 py-2 rounded-r-full ${
                    !newMessage.trim()
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
