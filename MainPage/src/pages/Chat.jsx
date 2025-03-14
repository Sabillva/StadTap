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

  useEffect(() => {
    // Load conversations from localStorage
    const userConversations = getUserConversations(user.id);
    setConversations(userConversations);
    setLoading(false);
  }, [user.id]);

  // Function to find a user to chat with
  const handleFindUsers = () => {
    navigate("/users");
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
        <p className="mt-4 text-gray-300">Loading conversations...</p>
      </div>
    );
  }

  // If no conversations, show empty state
  if (conversations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
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
          <h2 className="text-2xl font-semibold mb-4 text-white">
            No Conversations Yet
          </h2>
          <p className="text-gray-300 mb-6">
            You haven't started any conversations yet. Find users to chat with!
          </p>
          <button
            onClick={handleFindUsers}
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Find Users to Chat With
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar - Conversations List */}
          <div className="w-full md:w-1/3 border-r border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Messages</h2>
              <button
                onClick={handleFindUsers}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
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
                  <line x1="12" y1="11" x2="12" y2="11"></line>
                  <line x1="12" y1="8" x2="12" y2="8"></line>
                  <line x1="12" y1="14" x2="12" y2="14"></line>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(600px-64px)]">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.partnerId}
                  to={`/chat/${conversation.partnerId}`}
                  className="block p-4 border-b border-gray-700 hover:bg-[#333] transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {conversation.partnerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">
                          {conversation.partnerName}
                        </h3>
                        {conversation.timestamp && (
                          <span className="text-xs text-gray-400">
                            {formatMessageTime(conversation.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        @{conversation.partnerUsername}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content - Select a conversation */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#222]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500 mb-4"
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
            <h3 className="text-xl font-medium text-white mb-2">
              Select a Conversation
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Choose a conversation from the sidebar or start a new one
            </p>
            <button
              onClick={handleFindUsers}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Find New Users to Chat With
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
