"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  formatMessageTime,
  isUserOnline,
  formatLastActive,
  updateUserLastActive,
  setTypingStatus,
  isPartnerTyping,
  sendFileMessage,
  isFileMessage,
  getFileFromMessage,
} from "../utils/chatUtils";

const ChatDetail = () => {
  const { id: recipientId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample emojis for the emoji picker
  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "😎",
    "🙏",
    "👏",
    "🤔",
    "😢",
    "😍",
    "👋",
    "⚽",
    "🏆",
  ];

  // Sample attachment options
  const attachOptions = [
    { icon: "📷", label: "Photo", type: "image/*" },
    { icon: "📁", label: "File", type: "application/pdf,text/plain" },
  ];

  // Update user's last active timestamp
  useEffect(() => {
    updateUserLastActive(currentUser.id);
  }, [currentUser.id]);

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

      // Check if partner is typing
      const partnerTypingStatus = isPartnerTyping(currentUser.id, recipientId);
      setIsTyping(partnerTypingStatus);

      // Add a small delay to make the loading animation visible
      if (loading) {
        setTimeout(() => {
          setLoading(false);
          // Focus the input field after loading
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 800);
      }
    };

    loadData();

    // Set up interval to refresh messages and typing status
    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser.id, recipientId, navigate, loading]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close emoji picker and attach menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-button")
      ) {
        setShowEmojiPicker(false);
      }

      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(event.target) &&
        !event.target.closest(".attach-button")
      ) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle typing status
  useEffect(() => {
    if (newMessage.trim()) {
      setTypingStatus(currentUser.id, recipientId, true);
    } else {
      setTypingStatus(currentUser.id, recipientId, false);
    }

    // Clear typing status when component unmounts
    return () => {
      setTypingStatus(currentUser.id, recipientId, false);
    };
  }, [newMessage, currentUser.id, recipientId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // Send message
    const message = sendMessage(currentUser.id, recipientId, newMessage.trim());

    // Update local state
    if (message) {
      setMessages([...messages, message]);
    }

    // Clear input
    setNewMessage("");

    // Focus the input field again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);

    // Focus the input field after adding emoji
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAttachmentClick = (option) => {
    setShowAttachMenu(false);

    // Set the file input accept attribute and trigger click
    if (fileInputRef.current) {
      fileInputRef.current.accept = option.type;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setFileUploading(true);

      // Send file message
      const message = await sendFileMessage(currentUser.id, recipientId, file);

      // Update local state
      if (message) {
        setMessages([...messages, message]);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setFileUploading(false);
    }
  };

  // Render file message content
  const renderMessageContent = (message) => {
    if (isFileMessage(message)) {
      const fileData = getFileFromMessage(message);

      if (fileData.fileType.startsWith("image/")) {
        return (
          <div className="message-file">
            <img
              src={fileData.fileUrl || "/placeholder.svg"}
              alt={fileData.fileName}
              className="max-w-full rounded-lg max-h-60 object-contain mb-2"
            />
            <div className="text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {fileData.fileName}
            </div>
          </div>
        );
      } else {
        return (
          <div className="message-file">
            <div className="flex items-center bg-white/10 p-3 rounded-lg mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <div>
                <div className="font-medium">{fileData.fileName}</div>
                <div className="text-xs opacity-70">
                  {(fileData.fileSize / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <a
              href={fileData.fileUrl}
              download={fileData.fileName}
              className="text-sm flex items-center hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </a>
          </div>
        );
      }
    } else {
      return message.content;
    }
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

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const slideInVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
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
            Loading conversation...
          </motion.p>
        </div>
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
        <div className="flex h-full">
          {/* Mobile Info Panel */}
          <AnimatePresence>
            {showMobileInfo && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideInVariants}
                className="absolute inset-0 z-20 bg-[#171717]/95 backdrop-blur-md md:hidden"
              >
                <div className="p-4 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#fffce1]">
                      Profile
                    </h2>
                    <button
                      onClick={() => setShowMobileInfo(false)}
                      className="p-2 bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#2a2a2a] transition-all duration-300"
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold text-4xl mb-4 shadow-lg">
                        {recipient.firstName.charAt(0)}
                      </div>
                      {isUserOnline(recipient) && (
                        <div className="absolute bottom-4 right-0 w-5 h-5 bg-[#4de840] border-2 border-[#171717] rounded-full"></div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-[#fffce1]">
                      {recipient.firstName} {recipient.lastName}
                    </h3>
                    <p className="text-[#fffce1]/50">@{recipient.username}</p>
                    <div className="mt-2 px-3 py-1 bg-[#4de840]/10 text-[#4de840] rounded-full text-xs">
                      {isUserOnline(recipient) ? "Online" : "Offline"}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
                      <h4 className="text-sm text-[#fffce1]/50 mb-1">Email</h4>
                      <p className="text-[#fffce1]">{recipient.email}</p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
                      <h4 className="text-sm text-[#fffce1]/50 mb-1">
                        User Type
                      </h4>
                      <p className="text-[#fffce1] capitalize">
                        {recipient.userType}
                      </p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
                      <h4 className="text-sm text-[#fffce1]/50 mb-1">
                        Last Active
                      </h4>
                      <p className="text-[#fffce1]">
                        {isUserOnline(recipient)
                          ? "Currently active"
                          : formatLastActive(recipient.lastActive)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Link
                        to={`/users/${recipient.id}`}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium shadow-lg shadow-[#4de840]/20 transition-all duration-300"
                      >
                        <div className="flex items-center justify-center">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          View Full Profile
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar - User Info (hidden on mobile) */}
          <motion.div
            variants={itemVariants}
            className="hidden md:block w-1/4 border-r border-white/10 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <Link
                  to="/chat"
                  className="p-2 bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#2a2a2a] transition-all duration-300"
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
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h2 className="text-lg font-bold text-[#fffce1]">Profile</h2>
                <div className="w-5"></div> {/* Spacer for alignment */}
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold text-2xl mb-4 shadow-lg">
                    {recipient.firstName.charAt(0)}
                  </div>
                  {isUserOnline(recipient) && (
                    <div className="absolute bottom-4 right-0 w-4 h-4 bg-[#4de840] border-2 border-[#171717] rounded-full"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#fffce1]">
                  {recipient.firstName} {recipient.lastName}
                </h3>
                <p className="text-[#fffce1]/50 mb-2">@{recipient.username}</p>
                <div className="px-3 py-1 bg-[#4de840]/10 text-[#4de840] rounded-full text-xs mb-6">
                  {isUserOnline(recipient) ? "Online" : "Offline"}
                </div>

                <div className="w-full space-y-4 mb-6">
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3">
                    <h4 className="text-xs text-[#fffce1]/50 mb-1">Email</h4>
                    <p className="text-sm text-[#fffce1]">{recipient.email}</p>
                  </div>

                  <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3">
                    <h4 className="text-xs text-[#fffce1]/50 mb-1">
                      User Type
                    </h4>
                    <p className="text-sm text-[#fffce1] capitalize">
                      {recipient.userType}
                    </p>
                  </div>

                  <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3">
                    <h4 className="text-xs text-[#fffce1]/50 mb-1">
                      Last Active
                    </h4>
                    <p className="text-sm text-[#fffce1]">
                      {isUserOnline(recipient)
                        ? "Currently active"
                        : formatLastActive(recipient.lastActive)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-white/10">
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Link
                    to={`/users/${recipient.id}`}
                    className="block w-full text-center px-4 py-2.5 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium shadow-lg shadow-[#4de840]/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      View Full Profile
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Chat */}
          <motion.div
            variants={itemVariants}
            className="flex-1 flex flex-col bg-[#0e100f]/70"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <div className="md:hidden mr-2">
                  <Link
                    to="/chat"
                    className="p-2 bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#2a2a2a] transition-all duration-300 inline-flex"
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
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </Link>
                </div>
                <div
                  className="flex items-center"
                  onClick={() => setShowMobileInfo(true)}
                >
                  <div className="relative cursor-pointer md:cursor-default">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold mr-3 shadow-lg">
                      {recipient.firstName.charAt(0)}
                    </div>
                    {isUserOnline(recipient) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4de840] border-2 border-[#0e100f] rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#fffce1]">
                      {recipient.firstName} {recipient.lastName}
                    </h3>
                    <p className="text-xs text-[#fffce1]/50">
                      {isTyping ? (
                        <span className="text-[#4de840] flex items-center">
                          <motion.span
                            animate={{
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className="mr-1"
                          >
                            typing
                          </motion.span>
                          <motion.span
                            animate={{
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 0.2,
                            }}
                          >
                            •••
                          </motion.span>
                        </span>
                      ) : isUserOnline(recipient) ? (
                        "Online"
                      ) : (
                        `Last active ${formatLastActive(recipient.lastActive)}`
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setShowMobileInfo(true)}
                  className="p-2 bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#2a2a2a] transition-all duration-300 md:hidden"
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
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#4de840]/20 scrollbar-track-transparent"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(77, 232, 64, 0.03) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 rounded-full flex items-center justify-center mb-4 relative"
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
                      className="h-10 w-10 text-[#4de840] relative z-10"
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
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-[#fffce1] text-lg font-medium"
                  >
                    Start a conversation
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-[#fffce1]/50 text-sm mt-2 max-w-xs"
                  >
                    Send a message to {recipient.firstName} to start chatting
                  </motion.p>
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
                            <span className="px-3 py-1 bg-[#1a1a1a]/70 text-[#fffce1]/50 text-xs rounded-full">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={messageVariants}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold mr-2 self-end">
                              {recipient.firstName.charAt(0)}
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                              isCurrentUser
                                ? "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-br-none"
                                : "bg-[#1a1a1a] text-[#fffce1] rounded-bl-none"
                            }`}
                          >
                            <div className="break-words">
                              {renderMessageContent(message)}
                            </div>
                            <div
                              className={`text-xs mt-1 flex items-center ${
                                isCurrentUser
                                  ? "text-[#0e100f]/70 justify-end"
                                  : "text-[#fffce1]/50"
                              }`}
                            >
                              {formatMessageTime(message.timestamp)}
                              {isCurrentUser && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 ml-1"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          {isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold ml-2 self-end">
                              {currentUser.firstName.charAt(0)}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={messageVariants}
                      className="flex justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold mr-2 self-end">
                        {recipient.firstName.charAt(0)}
                      </div>
                      <div className="px-4 py-3 bg-[#1a1a1a] rounded-2xl rounded-bl-none">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className="w-2 h-2 bg-[#fffce1]/50 rounded-full"
                          ></motion.div>
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 0.2,
                            }}
                            className="w-2 h-2 bg-[#fffce1]/50 rounded-full"
                          ></motion.div>
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 0.4,
                            }}
                            className="w-2 h-2 bg-[#fffce1]/50 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative">
                <div className="flex">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 pl-11 pr-11 bg-[#1a1a1a] border border-white/10 rounded-l-full text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:ring-2 focus:ring-[#4de840]/50 transition-all"
                      disabled={fileUploading}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-[#fffce1]/50 hover:text-[#4de840] transition-colors emoji-button"
                        disabled={fileUploading}
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
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                          <line x1="9" y1="9" x2="9.01" y2="9"></line>
                          <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="text-[#fffce1]/50 hover:text-[#4de840] transition-colors attach-button"
                        disabled={fileUploading}
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
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    type="submit"
                    disabled={!newMessage.trim() || fileUploading}
                    className={`px-4 py-3 rounded-r-full ${
                      !newMessage.trim() || fileUploading
                        ? "bg-[#1a1a1a] text-[#fffce1]/30 cursor-not-allowed"
                        : "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] shadow-lg shadow-[#4de840]/20"
                    } transition-all duration-300`}
                  >
                    {fileUploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-[#fffce1]/30 border-t-[#fffce1]/80 rounded-full"
                      />
                    ) : (
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
                    )}
                  </motion.button>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={fileUploading}
                />

                {/* Emoji Picker */}
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      ref={emojiPickerRef}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={popupVariants}
                      className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-lg p-2 z-10"
                    >
                      <div className="grid grid-cols-5 gap-2">
                        {emojis.map((emoji, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Attachment Menu */}
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      ref={attachMenuRef}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={popupVariants}
                      className="absolute bottom-full right-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-lg p-2 z-10"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {attachOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAttachmentClick(option)}
                            className="flex flex-col items-center justify-center p-3 hover:bg-white/5 rounded-lg transition-colors"
                            disabled={fileUploading}
                          >
                            <span className="text-xl mb-1">{option.icon}</span>
                            <span className="text-xs text-[#fffce1]/70">
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatDetail;
