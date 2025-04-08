// Chat utilities for managing conversations and messages

// Get user conversations from localStorage
export const getUserConversations = (userId) => {
  try {
    // Get all messages from localStorage
    const storedMessages = localStorage.getItem("messages");
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Get all users from localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Filter messages where the current user is either sender or recipient
    const userMessages = messages.filter(
      (message) => message.senderId === userId || message.recipientId === userId
    );

    // Group messages by conversation partner
    const conversationPartners = {};
    userMessages.forEach((message) => {
      const partnerId =
        message.senderId === userId ? message.recipientId : message.senderId;

      if (!conversationPartners[partnerId]) {
        conversationPartners[partnerId] = {
          messages: [],
          unread: 0,
        };
      }

      conversationPartners[partnerId].messages.push(message);

      // Count unread messages
      if (message.recipientId === userId && !message.read) {
        conversationPartners[partnerId].unread += 1;
      }
    });

    // Format conversations
    const conversations = Object.keys(conversationPartners)
      .map((partnerId) => {
        const partner = users.find((user) => user.id === partnerId);
        if (!partner) return null;

        const partnerMessages = conversationPartners[partnerId].messages;
        const lastMessage = partnerMessages.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )[0];

        return {
          partnerId,
          partnerName: `${partner.firstName} ${partner.lastName}`,
          partnerUsername: partner.username,
          lastMessage: isFileMessage(lastMessage)
            ? "📎 Attachment"
            : lastMessage.content,
          timestamp: lastMessage.timestamp,
          unread: conversationPartners[partnerId].unread,
          online: isUserOnline(partner),
          lastActive: partner.lastActive || null,
        };
      })
      .filter(Boolean);

    // Sort conversations by last message timestamp (newest first)
    return conversations.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error("Error getting user conversations:", error);
    return [];
  }
};

// Get conversation messages between two users
export const getConversationMessages = (userId, partnerId) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Filter messages between the two users
    const conversationMessages = messages.filter(
      (message) =>
        (message.senderId === userId && message.recipientId === partnerId) ||
        (message.senderId === partnerId && message.recipientId === userId)
    );

    // Sort messages by timestamp (oldest first)
    return conversationMessages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  } catch (error) {
    console.error("Error getting conversation messages:", error);
    return [];
  }
};

// Send a message
export const sendMessage = (senderId, recipientId, content) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      senderId,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Add message to localStorage
    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));

    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

// Delete a message
export const deleteMessage = (messageId) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Filter out the message to delete
    const updatedMessages = messages.filter(
      (message) => message.id !== messageId
    );

    // Update localStorage
    localStorage.setItem("messages", JSON.stringify(updatedMessages));

    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};

// Delete an entire conversation
export const deleteConversation = (userId, partnerId) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Filter out all messages between these two users
    const updatedMessages = messages.filter(
      (message) =>
        !(
          (message.senderId === userId && message.recipientId === partnerId) ||
          (message.senderId === partnerId && message.recipientId === userId)
        )
    );

    // Update localStorage
    localStorage.setItem("messages", JSON.stringify(updatedMessages));

    return true;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
};

// Edit a message
export const editMessage = (messageId, newContent) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Find and update the message
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return {
          ...message,
          content: newContent,
          edited: true,
          editedAt: new Date().toISOString(),
        };
      }
      return message;
    });

    // Update localStorage
    localStorage.setItem("messages", JSON.stringify(updatedMessages));

    return updatedMessages.find((m) => m.id === messageId);
  } catch (error) {
    console.error("Error editing message:", error);
    return null;
  }
};

// Check if a message is within the last hour
export const isMessageWithinHour = (timestamp) => {
  const messageTime = new Date(timestamp);
  const now = new Date();
  const hourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

  return now - messageTime < hourInMs;
};

// Update message read status
export const updateMessageReadStatus = (messageId, isRead) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = JSON.parse(storedMessages);

    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return { ...message, read: isRead };
      }
      return message;
    });

    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.error("Error updating message read status:", error);
    return false;
  }
};

// Mark all messages from a partner as read
export const markMessagesAsRead = (userId, partnerId) => {
  try {
    const storedMessages = localStorage.getItem("messages");
    const messages = JSON.parse(storedMessages);

    // Find unread messages sent to the current user from the partner
    const updatedMessages = messages.map((message) => {
      if (
        message.senderId === partnerId &&
        message.recipientId === userId &&
        !message.read
      ) {
        return { ...message, read: true, readAt: new Date().toISOString() };
      }
      return message;
    });

    // Update localStorage
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

// Format message time
export const formatMessageTime = (timestamp) => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  // Check if the message was sent today
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Check if the message was sent yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Check if the message was sent this week
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (messageDate > oneWeekAgo) {
    const options = { weekday: "long" };
    return messageDate.toLocaleDateString(undefined, options);
  }

  // Otherwise, return the date
  return messageDate.toLocaleDateString();
};

// Check if user is online (simulated)
export const isUserOnline = (user) => {
  // In a real app, this would check against an online status service
  // For now, we'll simulate by checking if the user has been active in the last 5 minutes
  if (!user || !user.lastActive) return false;

  const lastActive = new Date(user.lastActive);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  return lastActive > fiveMinutesAgo;
};

// Format last active time
export const formatLastActive = (timestamp) => {
  if (!timestamp) return "Never";

  const lastActive = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - lastActive) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return lastActive.toLocaleDateString();
};

// Update user's last active timestamp
export const updateUserLastActive = (userId) => {
  try {
    const storedUsers = localStorage.getItem("users");
    const users = JSON.parse(storedUsers);

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, lastActive: new Date().toISOString() };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error updating user's last active timestamp:", error);
  }
};

// Upload a file and return the URL
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      // In a real app, this would upload to a server
      // For now, we'll use FileReader to create a data URL
      const reader = new FileReader();

      reader.onload = (event) => {
        // Create a simulated URL for the file
        const fileData = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: event.target.result,
          uploadedAt: new Date().toISOString(),
        };

        // Store in localStorage
        const storedFiles = localStorage.getItem("uploadedFiles");
        const files = storedFiles ? JSON.parse(storedFiles) : [];
        files.push(fileData);
        localStorage.setItem("uploadedFiles", JSON.stringify(files));

        resolve(fileData);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

// Send a file message
export const sendFileMessage = async (senderId, recipientId, file) => {
  try {
    const fileData = await uploadFile(file);

    // Create message content with file info
    const content = JSON.stringify({
      type: "file",
      fileId: fileData.id,
      fileName: fileData.name,
      fileType: fileData.type,
      fileSize: fileData.size,
      fileUrl: fileData.url,
    });
    return sendMessage(senderId, recipientId, content);
  } catch (error) {
    console.error("Error sending file message:", error);
    return null;
  }
};

// Check if a message contains a file
export const isFileMessage = (message) => {
  try {
    const content = JSON.parse(message.content);
    return content && content.type === "file";
  } catch {
    return false;
  }
};

// Get file data from a message
export const getFileFromMessage = (message) => {
  try {
    return JSON.parse(message.content);
  } catch {
    return null;
  }
};

// Set typing status
export const setTypingStatus = (userId, partnerId, isTyping) => {
  try {
    const typingKey = `typing:${userId}:${partnerId}`;

    if (isTyping) {
      localStorage.setItem(typingKey, Date.now().toString());
    } else {
      localStorage.removeItem(typingKey);
    }
  } catch (error) {
    console.error("Error setting typing status:", error);
  }
};

// Check if partner is typing
export const isPartnerTyping = (userId, partnerId) => {
  try {
    const typingKey = `typing:${partnerId}:${userId}`;
    const typingTimestamp = localStorage.getItem(typingKey);

    if (!typingTimestamp) return false;

    // Check if typing status is recent (within last 5 seconds)
    const now = Date.now();
    const typingTime = Number.parseInt(typingTimestamp, 10);

    return now - typingTime < 5000;
  } catch (error) {
    console.error("Error checking typing status:", error);
    return false;
  }
};

// Add the deleteConversation function to your chatUtils.js file

export const deleteConversation2 = (userId, partnerId) => {
  try {
    // Get all conversations from localStorage
    const storedConversations = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    // Filter out the conversation between these two users
    const updatedConversations = storedConversations.filter(
      (conv) =>
        !(
          (conv.user1Id === userId && conv.user2Id === partnerId) ||
          (conv.user1Id === partnerId && conv.user2Id === userId)
        )
    );

    // Save the updated conversations back to localStorage
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));

    return true;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
};
