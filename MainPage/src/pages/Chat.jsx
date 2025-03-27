"use client";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { getUserConversations, formatMessageTime } from "../utils/chatUtils";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    try {
      // Load conversations from localStorage
      const userConversations = getUserConversations(user.id);
      setConversations(userConversations);

      // Add a small delay to make the loading animation visible
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setConversations([]);
      setLoading(false);
    }
  }, [user.id]);

  // Function to find a user to chat with
  const handleFindUsers = () => {
    navigate("/users");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4de840] border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="mt-4 text-[#fffce1]/70 text-lg">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  // If no conversations, show empty state
  if (conversations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-3xl mx-auto bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-[#4de840]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-[#4de840]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-[#fffce1]">
            No Conversations Yet
          </h2>
          <p className="text-[#fffce1]/70 max-w-md mx-auto mb-8">
            You haven't started any conversations yet. Find users to chat with
            and connect with the community!
          </p>
          <div className="inline-block">
            <button
              onClick={handleFindUsers}
              className="px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Find Users to Chat With
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar - Conversations List */}
          <div className="w-full md:w-1/3 border-r border-white/10">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#fffce1]">Messages</h2>
              <div>
                <button
                  onClick={handleFindUsers}
                  className="p-2 bg-[#4de840]/10 border border-[#4de840]/20 text-[#4de840] rounded-full hover:bg-[#4de840]/20 transition-all duration-300"
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                    <line x1="12" y1="7" x2="12" y2="13"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-64px)]">
              {conversations.map((conversation, index) => (
                <div
                  key={conversation.partnerId}
                  className={`border-b border-white/10 transition-all duration-300 ${
                    selectedConversation === conversation.partnerId
                      ? "bg-[#4de840]/10"
                      : "hover:bg-[#ffffff]/5"
                  }`}
                >
                  <Link
                    to={`/chat/${conversation.partnerId}`}
                    className="block p-4"
                    onClick={() =>
                      setSelectedConversation(conversation.partnerId)
                    }
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold mr-3 shadow-lg">
                        {conversation.partnerName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-[#fffce1]">
                            {conversation.partnerName}
                          </h3>
                          {conversation.timestamp && (
                            <span className="text-xs text-[#fffce1]/50">
                              {formatMessageTime(conversation.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#fffce1]/50 truncate">
                          @{conversation.partnerUsername}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#fffce1]/70 truncate max-w-[80%]">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-[#4de840] text-[#0e100f] text-xs font-bold px-2 py-1 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Select a conversation */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#0e100f]/70">
            <div className="w-20 h-20 bg-[#4de840]/10 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#4de840]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#fffce1] mb-2">
              Select a Conversation
            </h3>
            <p className="text-[#fffce1]/70 text-center mb-8 max-w-md">
              Choose a conversation from the sidebar or start a new one by
              finding users to chat with
            </p>
            <div>
              <button
                onClick={handleFindUsers}
                className="px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Find New Users to Chat With
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
