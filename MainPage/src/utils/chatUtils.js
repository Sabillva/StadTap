/**
 * Get all messages for a specific conversation between two users
 * @param {string} userId - Current user ID
 * @param {string} recipientId - Recipient user ID
 * @returns {Array} Array of messages
 */
export const getConversationMessages = (userId, recipientId) => {
  const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");

  // Filter messages that belong to this conversation (sent by either user to the other)
  return allMessages
    .filter(
      (message) =>
        (message.senderId === userId && message.recipientId === recipientId) ||
        (message.senderId === recipientId && message.recipientId === userId)
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

/**
 * Get all conversations for a user
 * @param {string} userId - Current user ID
 * @returns {Array} Array of conversation objects with the last message
 */
export const getUserConversations = (userId) => {
  const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Find all unique users this user has conversed with
  const conversationPartners = new Set();

  allMessages.forEach((message) => {
    if (message.senderId === userId) {
      conversationPartners.add(message.recipientId);
    } else if (message.recipientId === userId) {
      conversationPartners.add(message.senderId);
    }
  });

  // Create conversation objects with the last message
  return Array.from(conversationPartners)
    .map((partnerId) => {
      const partner = users.find((user) => user.id === partnerId);

      // Get all messages between these users
      const messages = allMessages
        .filter(
          (message) =>
            (message.senderId === userId &&
              message.recipientId === partnerId) ||
            (message.senderId === partnerId && message.recipientId === userId)
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

      const lastMessage = messages[0];

      return {
        partnerId,
        partnerName: partner
          ? `${partner.firstName} ${partner.lastName}`
          : "Unknown User",
        partnerUsername: partner ? partner.username : "unknown",
        lastMessage: lastMessage ? lastMessage.content : "",
        timestamp: lastMessage ? lastMessage.timestamp : null,
        unread: messages.filter((m) => m.senderId === partnerId && !m.read)
          .length,
      };
    })
    .sort((a, b) => {
      // Sort by timestamp (newest first)
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
};

/**
 * Send a message to another user
 * @param {string} senderId - Sender user ID
 * @param {string} recipientId - Recipient user ID
 * @param {string} content - Message content
 * @returns {Object} The created message
 */
export const sendMessage = (senderId, recipientId, content) => {
  const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");

  const newMessage = {
    id: Date.now().toString(),
    senderId,
    recipientId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  allMessages.push(newMessage);
  localStorage.setItem("messages", JSON.stringify(allMessages));

  return newMessage;
};

/**
 * Mark all messages from a specific user as read
 * @param {string} userId - Current user ID
 * @param {string} senderId - Sender user ID whose messages to mark as read
 */
export const markMessagesAsRead = (userId, senderId) => {
  const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");

  const updatedMessages = allMessages.map((message) => {
    if (
      message.senderId === senderId &&
      message.recipientId === userId &&
      !message.read
    ) {
      return { ...message, read: true };
    }
    return message;
  });

  localStorage.setItem("messages", JSON.stringify(updatedMessages));
};

/**
 * Get the total number of unread messages for a user
 * @param {string} userId - Current user ID
 * @returns {number} Number of unread messages
 */
export const getUnreadMessageCount = (userId) => {
  const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");

  return allMessages.filter(
    (message) => message.recipientId === userId && !message.read
  ).length;
};

/**
 * Format a timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    // Yesterday
    return "Yesterday";
  } else if (diffDays < 7) {
    // This week - show day name
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};
