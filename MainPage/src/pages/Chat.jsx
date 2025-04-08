"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
import {
  getUserConversations,
  formatMessageTime,
  updateUserLastActive,
} from "../utils/chatUtils";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("all"); // "all", "users", "messages"
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const searchRef = useRef(null);
  const searchOptionsRef = useRef(null);

  // Update user's last active timestamp
  useEffect(() => {
    updateUserLastActive(user.id);

    // Set up interval to update last active status
    const interval = setInterval(() => {
      updateUserLastActive(user.id);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user.id]);

  // Load conversations
  useEffect(() => {
    const loadConversations = () => {
      try {
        // Load conversations from localStorage
        const userConversations = getUserConversations(user.id);
        setConversations(userConversations);
        setFilteredConversations(userConversations);

        // Calculate total unread messages
        let unreadCount = 0;
        userConversations.forEach((conv) => {
          unreadCount += conv.unread || 0;
        });
        setTotalUnread(unreadCount);

        setLoading(false);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setConversations([]);
        setFilteredConversations([]);
        setLoading(false);
      }
    };

    loadConversations();

    // Set up interval to refresh conversations
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = conversations.filter((conversation) => {
      // Search by username/name
      const nameMatch =
        (searchMode === "all" || searchMode === "users") &&
        (conversation.partnerName.toLowerCase().includes(query) ||
          conversation.partnerUsername.toLowerCase().includes(query));

      // Search by message content
      const messageMatch =
        (searchMode === "all" || searchMode === "messages") &&
        conversation.lastMessage.toLowerCase().includes(query);

      return nameMatch || messageMatch;
    });

    setFilteredConversations(filtered);
  }, [searchQuery, searchMode, conversations]);

  // Close search options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchOptionsRef.current &&
        !searchOptionsRef.current.contains(event.target) &&
        !event.target.closest(".search-options-button")
      ) {
        setShowSearchOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const searchOptionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex justify-center items-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-20 h-20 mx-auto"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-[#4de840]/20 blur-md"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute inset-0 border-4 border-[#4de840] border-t-transparent rounded-full"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-[#fffce1]/70 text-lg"
          >
            Loading conversations...
          </motion.p>
        </div>
      </div>
    );
  }

  // If no conversations, show empty state
  if (conversations.length === 0) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>

          {/* Animated particles */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#4de840]/30"
          />
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#4de840]/20"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full bg-[#4de840]/10"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-[#4de840]/10 blur-md"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#4de840] relative z-10"
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
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold mb-3 text-[#fffce1]"
          >
            Start Connecting
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[#fffce1]/70 max-w-md mx-auto mb-8"
          >
            Your message inbox is empty. Find users to chat with and start
            building connections in the community!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className="inline-block"
          >
            <button
              onClick={handleFindUsers}
              className="px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium shadow-lg shadow-[#4de840]/20 transition-all duration-300 flex items-center cursor-pointer"
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
              Discover People
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>

        {/* Animated particles */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#4de840]/30"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#4de840]/20"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full bg-[#4de840]/10"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-6xl h-[85vh] bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="p-5 border-b border-white/10 flex justify-between items-center"
          >
            <h2 className="text-2xl font-bold text-[#fffce1] flex items-center">
              <motion.div
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mr-3 text-[#4de840]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </motion.div>
              Messages
              {totalUnread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="ml-2 bg-[#4de840] text-[#0e100f] text-xs font-bold px-2 py-1 rounded-full"
                >
                  {totalUnread}
                </motion.span>
              )}
            </h2>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <button
                onClick={handleFindUsers}
                className="px-4 py-2.5 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium shadow-md hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-white/10 overflow-hidden flex flex-col">
              <div className="p-4">
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full px-4 py-3 pl-11 bg-[#1a1a1a] border-2 border-white/10 rounded-full text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:border-[#4de840]/50 focus:ring-2 focus:ring-[#4de840]/20 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fffce1]/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => setShowSearchOptions(!showSearchOptions)}
                      className="text-[#fffce1]/50 hover:text-[#4de840] transition-colors cursor-pointer search-options-button"
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
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>

                  {/* Search Options Dropdown */}
                  <AnimatePresence>
                    {showSearchOptions && (
                      <motion.div
                        ref={searchOptionsRef}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={searchOptionVariants}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border-2 border-white/10 rounded-3xl shadow-lg z-10 overflow-hidden"
                      >
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setSearchMode("all");
                              setShowSearchOptions(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-3xl mb-1 transition-colors cursor-pointer ${
                              searchMode === "all"
                                ? "bg-[#4de840]/20 text-[#4de840]"
                                : "text-[#fffce1] hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line
                                  x1="21"
                                  y1="21"
                                  x2="16.65"
                                  y2="16.65"
                                ></line>
                              </svg>
                              Search Everything
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setSearchMode("users");
                              setShowSearchOptions(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-3xl mb-1 transition-colors cursor-pointer ${
                              searchMode === "users"
                                ? "bg-[#4de840]/20 text-[#4de840]"
                                : "text-[#fffce1] hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              Search Users
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setSearchMode("messages");
                              setShowSearchOptions(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-3xl transition-colors cursor-pointer ${
                              searchMode === "messages"
                                ? "bg-[#4de840]/20 text-[#4de840]"
                                : "text-[#fffce1] hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              Search Messages
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Mode Indicator */}
                <div className="mt-2 px-1 flex items-center text-xs text-[#fffce1]/50">
                  <span>Searching in: </span>
                  <span className="ml-1 px-2 py-0.5 bg-[#4de840]/10 text-[#4de840] rounded-full text-xs">
                    {searchMode === "all" && "All"}
                    {searchMode === "users" && "Users"}
                    {searchMode === "messages" && "Messages"}
                  </span>

                  {searchQuery && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{filteredConversations.length} results</span>
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {filteredConversations.length === 0 && searchQuery ? (
                  <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#fffce1]/30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                    <p className="text-[#fffce1]/70">No results found</p>
                    <p className="text-[#fffce1]/50 text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.partnerId}
                      custom={index}
                      variants={cardVariants}
                      whileHover="hover"
                      className={`transition-all duration-300 ${
                        selectedConversation === conversation.partnerId
                          ? "bg-[#4de840]/10"
                          : ""
                      }`}
                    >
                      <Link
                        to={`/chat/${conversation.partnerId}`}
                        className="block p-4"
                        onClick={() =>
                          setSelectedConversation(conversation.partnerId)
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] text-xl font-bold shadow-lg">
                              {conversation.partnerName.charAt(0)}
                            </div>
                            {conversation.online && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#4de840] border-2 border-[#171717] rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium text-[#fffce1] truncate">
                                {conversation.partnerName}
                              </h3>
                              {conversation.timestamp && (
                                <span className="text-xs text-[#fffce1]/50 ml-2 whitespace-nowrap">
                                  {formatMessageTime(conversation.timestamp)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#fffce1]/50 mb-1">
                              @{conversation.partnerUsername}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-[#fffce1]/70 truncate max-w-[80%]">
                                {conversation.lastMessage}
                              </p>
                              {conversation.unread > 0 && (
                                <span className="bg-[#4de840] text-[#0e100f] text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Select a conversation placeholder */}
            <motion.div
              variants={itemVariants}
              className="hidden md:flex flex-1 flex-col justify-center items-center p-6 bg-[#0e100f]/70"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-28 h-28 bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 rounded-full flex items-center justify-center mb-6 relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-[#4de840]/10 blur-md"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-[#4de840] relative z-10"
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
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl font-bold text-[#fffce1] mb-2"
              >
                Your Messages
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-[#fffce1]/70 text-center mb-8 max-w-md"
              >
                Select a conversation from the sidebar to view your messages or
                start a new chat
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <button
                  onClick={handleFindUsers}
                  className="px-6 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium shadow-lg shadow-[#4de840]/20 transition-all duration-300 flex items-center cursor-pointer"
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
                  Start a New Conversation
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
