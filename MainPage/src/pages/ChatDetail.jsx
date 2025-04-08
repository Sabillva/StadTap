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
  deleteMessage,
  editMessage,
  isMessageWithinHour,
  deleteConversation,
} from "../utils/chatUtils";

const ChatDetail = () => {
  const { id: recipientId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showDeleteChatConfirm, setShowDeleteChatConfirm] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageOptionsRef = useRef(null);

  // Popular emojis for the emoji picker
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
    "👌",
    "🥰",
    "😁",
    "🤣",
    "😉",
    "🤩",
    "🤗",
    "🙄",
    "😴",
    "🤑",
    "🤯",
    "🥳",
    "😇",
    "🤝",
    "👀",
  ];

  // Attachment options
  const attachOptions = [
    { icon: "📷", label: "Photo", type: "image/*" },
    {
      icon: "📁",
      label: "Document",
      type: "application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      icon: "📊",
      label: "Spreadsheet",
      type: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  ];

  // Update user's last active timestamp
  useEffect(() => {
    updateUserLastActive(currentUser.id);

    // Set up interval to update last active status
    const interval = setInterval(() => {
      updateUserLastActive(currentUser.id);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentUser.id]);

  // Load recipient data and messages
  useEffect(() => {
    const loadData = () => {
      try {
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

        // Only update messages if there are new ones to prevent scroll jumping
        if (JSON.stringify(conversationMessages) !== JSON.stringify(messages)) {
          setMessages(conversationMessages);

          // Only auto scroll if we're already at the bottom or there's a new message from the partner
          const isAtBottom = isScrolledToBottom();
          const hasNewPartnerMessage =
            conversationMessages.length > messages.length &&
            conversationMessages[conversationMessages.length - 1]?.senderId ===
              recipientId;

          setAutoScroll(isAtBottom || hasNewPartnerMessage);
        }

        // Mark messages as read
        markMessagesAsRead(currentUser.id, recipientId);

        // Check if partner is typing
        const partnerTypingStatus = isPartnerTyping(
          currentUser.id,
          recipientId
        );
        setIsTyping(partnerTypingStatus);

        // Add a small delay to make the loading animation visible
        if (loading) {
          setTimeout(() => {
            setLoading(false);
            // Focus the input field after loading
            if (inputRef.current && !editingMessage) {
              inputRef.current.focus();
            }
          }, 800);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        setLoading(false);
        navigate("/chat");
      }
    };

    loadData();

    // Set up interval to refresh messages and typing status
    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser.id, recipientId, navigate, loading, messages]);

  // Check if scrolled to bottom
  const isScrolledToBottom = () => {
    if (!messagesContainerRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
  };

  // Handle scroll events
  const handleScroll = () => {
    setAutoScroll(isScrolledToBottom());
  };

  // Scroll to bottom when messages change and autoScroll is true
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

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

      // Only close message options if clicking outside both the options menu and the options button
      if (
        messageOptionsRef.current &&
        !messageOptionsRef.current.contains(event.target) &&
        !event.target.closest(".message-options-button")
      ) {
        setShowMessageOptions(null);
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

  // Handle message sending
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (editingMessage) {
      handleUpdateMessage();
      return;
    }

    if (!newMessage.trim()) return;

    // Send message
    const message = sendMessage(currentUser.id, recipientId, newMessage.trim());

    // Update local state
    if (message) {
      setMessages([...messages, message]);
      setAutoScroll(true);
    }

    // Clear input
    setNewMessage("");

    // Focus the input field again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle message editing
  const handleStartEditing = (message) => {
    if (message.senderId !== currentUser.id) return;

    // Only allow editing messages sent within the last hour
    if (!isMessageWithinHour(message.timestamp)) {
      // Show toast or notification that message is too old to edit
      return;
    }

    setEditingMessage(message);

    // If it's a file message, we can't edit it
    if (!isFileMessage(message)) {
      setNewMessage(message.content);
    }

    // Close message options
    setShowMessageOptions(null);

    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle message update
  const handleUpdateMessage = () => {
    if (!editingMessage || !newMessage.trim()) {
      setEditingMessage(null);
      setNewMessage("");
      return;
    }

    // Update message
    const updatedMessage = editMessage(editingMessage.id, newMessage.trim());

    // Update local state
    if (updatedMessage) {
      setMessages(
        messages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    }

    // Clear editing state
    setEditingMessage(null);
    setNewMessage("");

    // Focus the input field again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle message deletion
  const handleDeleteMessage = (messageId) => {
    // Delete message
    const success = deleteMessage(messageId);

    // Update local state
    if (success) {
      setMessages(messages.filter((msg) => msg.id !== messageId));
    }

    // Close delete confirmation
    setShowDeleteConfirm(null);

    // Close message options
    setShowMessageOptions(null);
  };

  // Handle conversation deletion
  const handleDeleteConversation = () => {
    // Delete conversation
    const success = deleteConversation(currentUser.id, recipientId);

    // Navigate back to chat list
    if (success) {
      navigate("/chat");
    }

    // Close delete confirmation
    setShowDeleteChatConfirm(false);
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);

    // Focus the input field after adding emoji
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle attachment selection
  const handleAttachmentClick = (option) => {
    setShowAttachMenu(false);

    // Set the file input accept attribute and trigger click
    if (fileInputRef.current) {
      fileInputRef.current.accept = option.type;
      fileInputRef.current.click();
    }
  };

  // Handle file upload
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
        setAutoScroll(true);
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

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage("");

    // Focus the input field again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle toggle message options
  const toggleMessageOptions = (messageId) => {
    if (showMessageOptions === messageId) {
      setShowMessageOptions(null);
    } else {
      setShowMessageOptions(messageId);
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

  const optionsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (loading || !recipient) {
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
              className="absolute inset-0 rounded-full blur-md"
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
        className="w-full max-w-4xl h-[85vh] bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-2">
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
              <div className="flex items-center">
                <div className="relative">
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
            <div className="flex items-center gap-2">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link
                  to={`/users/${recipient.id}`}
                  className="w-10 h-10 flex items-center justify-center text-[#fffce1] bg-[#1a1a1a] border border-white/10 rounded-full hover:bg-[#2a2a2a] transition-all duration-300"
                  aria-label="View profile"
                >
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              </motion.div>
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <button
                  onClick={() => setShowDeleteChatConfirm(true)}
                  className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] border border-white/10 text-red-400 rounded-full hover:bg-[#2a2a2a] transition-all duration-300 cursor-pointer"
                  aria-label="Delete conversation"
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
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
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
                  transition={{ delay: 0.1, duration: 0.4 }}
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
                        } group relative`}
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
                            {message.edited && (
                              <span className="ml-1">(edited)</span>
                            )}
                          </div>
                        </div>
                        {isCurrentUser && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] font-bold ml-2 self-end">
                            {currentUser.firstName.charAt(0)}
                          </div>
                        )}

                        {/* Message options button (only visible on hover for current user's messages) */}
                        {isCurrentUser &&
                          isMessageWithinHour(message.timestamp) && (
                            <div className="absolute top-0 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => toggleMessageOptions(message.id)}
                                className="p-1.5 bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-full hover:bg-[#2a2a2a] transition-all duration-300 message-options-button cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
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

                              {/* Message options dropdown - always visible when opened */}
                              <AnimatePresence>
                                {showMessageOptions === message.id && (
                                  <motion.div
                                    ref={messageOptionsRef}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={optionsVariants}
                                    className="absolute top-0 right-8 mt-8 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg z-10 overflow-hidden"
                                  >
                                    <div className="py-1">
                                      {!isFileMessage(message) && (
                                        <button
                                          onClick={() =>
                                            handleStartEditing(message)
                                          }
                                          className="w-full text-left px-4 py-2 text-sm text-[#fffce1] hover:bg-[#4de840]/10 transition-colors flex items-center cursor-pointer"
                                        >
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
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                          </svg>
                                          Edit
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          setShowDeleteConfirm(message.id)
                                        }
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center cursor-pointer"
                                      >
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
                                          <polyline points="3 6 5 6 21 6"></polyline>
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
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
            {editingMessage && (
              <div className="mb-3 px-4 py-2.5 bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#4de840]/30 rounded-full flex justify-between items-center">
                <div className="text-sm text-[#fffce1]/70 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 text-[#4de840]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span className="text-[#4de840] font-medium">
                    Editing message
                  </span>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-[#fffce1]/50 hover:text-[#fffce1] transition-colors p-1 rounded-full hover:bg-white/5 cursor-pointer"
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
            )}

            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex items-center bg-[#1a1a1a]/80 backdrop-blur-sm rounded-full border-2 border-white/10 overflow-hidden shadow-lg">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      editingMessage
                        ? "Edit your message..."
                        : "Type a message..."
                    }
                    className="w-full px-4 py-4 pl-12 pr-12 bg-transparent text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:ring-0 border-0 transition-all"
                    disabled={fileUploading}
                  />
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-[#fffce1]/50 hover:text-[#4de840] transition-colors emoji-button p-2 rounded-full hover:bg-white/5 cursor-pointer"
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
                  <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-12">
                    <button
                      type="button"
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className="text-[#fffce1]/50 hover:text-[#4de840] transition-colors attach-button p-2 rounded-full hover:bg-white/5 cursor-pointer"
                      disabled={fileUploading || editingMessage}
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
                <div className="pr-2">
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    type="submit"
                    disabled={!newMessage.trim() || fileUploading}
                    className={`p-3 rounded-3xl ${
                      !newMessage.trim() || fileUploading
                        ? "bg-[#2a2a2a]/50 text-[#fffce1]/30 cursor-not-allowed"
                        : "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] shadow-lg shadow-[#4de840]/20"
                    } transition-all duration-300 flex items-center justify-center cursor-pointer`}
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
                    ) : editingMessage ? (
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
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
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
                    className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-lg p-2 z-10"
                  >
                    <div className="grid grid-cols-6 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEmojiClick(emoji)}
                          className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
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
                    className="absolute bottom-full right-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-lg p-2 z-10"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {attachOptions.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAttachmentClick(option)}
                          className="flex flex-col items-center justify-center p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
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
        </div>
      </motion.div>

      {/* Delete Message Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-sm mx-4"
            >
              <h3 className="text-lg font-bold text-[#fffce1] mb-2">
                Delete Message
              </h3>
              <p className="text-[#fffce1]/70 mb-6">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-[#2a2a2a] text-[#fffce1] rounded-lg hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMessage(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Chat Confirmation Modal */}
      <AnimatePresence>
        {showDeleteChatConfirm && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-sm mx-4"
            >
              <h3 className="text-lg font-bold text-[#fffce1] mb-2">
                Delete Conversation
              </h3>
              <p className="text-[#fffce1]/70 mb-6">
                Are you sure you want to delete this entire conversation with{" "}
                {recipient.firstName}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteChatConfirm(false)}
                  className="px-4 py-2 bg-[#2a2a2a] text-[#fffce1] rounded-lg hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConversation}
                  className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatDetail;
