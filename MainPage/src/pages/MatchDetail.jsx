"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [hasRequestedToJoin, setHasRequestedToJoin] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showConfirmModal, setShowConfirmModal] = useState({
    visible: false,
    type: "",
    requestId: null,
    title: "",
    message: "",
  });

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = storedMatches ? JSON.parse(storedMatches) : [];
    const foundMatch = matches.find((m) => m.id === id);

    if (!foundMatch) {
      navigate("/matches");
      return;
    }

    setMatch(foundMatch);
    setIsCreator(foundMatch.creatorId === user.id);

    // Check if user is an opponent or participant
    const isOpponent = foundMatch.opponentId === user.id;
    const isInParticipants =
      foundMatch.participants &&
      foundMatch.participants.some((p) => p.userId === user.id);
    const isAcceptedRequest =
      foundMatch.joinRequests &&
      foundMatch.joinRequests.some(
        (request) => request.userId === user.id && request.status === "accepted"
      );

    setIsParticipant(isOpponent || isInParticipants || isAcceptedRequest);

    // Check if user has already requested to join as opponent
    setHasRequestedToJoin(
      (foundMatch.joinRequests &&
        foundMatch.joinRequests.some((request) => request.id === user.id)) ||
        false
    );

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [id, navigate, user.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isMatchPast = (dateString) => {
    if (!dateString) return false;

    const matchDate = new Date(dateString);
    const now = new Date();
    return matchDate < now;
  };

  const handleDeleteMatch = () => {
    setShowConfirmModal({
      visible: true,
      type: "deleteMatch",
      title: "Delete Match",
      message:
        "Are you sure you want to delete this match? This action cannot be undone.",
    });
  };

  const confirmDeleteMatch = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.filter((m) => m.id !== id);

    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    setShowConfirmModal({
      visible: false,
      type: "",
      requestId: null,
      title: "",
      message: "",
    });
    navigate("/matches");
  };

  const handleJoinRequest = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          joinRequests: [
            ...(m.joinRequests || []),
            {
              id: user.id,
              username: user.username,
              requestDate: new Date().toISOString(),
              status: "pending",
            },
          ],
        };
      }
      return m;
    });

    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    setHasRequestedToJoin(true);

    // Update the match state
    setMatch(updatedMatches.find((m) => m.id === id));
  };

  const handleCancelRequest = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          joinRequests: (m.joinRequests || []).filter(
            (request) => request.id !== user.id
          ),
        };
      }
      return m;
    });

    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    setHasRequestedToJoin(false);

    // Update the match state
    setMatch(updatedMatches.find((m) => m.id === id));
  };

  const handleAcceptRequest = (requestId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.map((m) => {
      if (m.id === id) {
        const request = (m.joinRequests || []).find((r) => r.id === requestId);
        return {
          ...m,
          hasOpponent: true,
          opponentId: request.id,
          opponentName: request.username,
          joinRequests: [], // Clear all requests once an opponent is accepted
        };
      }
      return m;
    });

    localStorage.setItem("matches", JSON.stringify(updatedMatches));

    // Update the match state
    setMatch(updatedMatches.find((m) => m.id === id));
  };

  const handleRejectRequest = (requestId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          joinRequests: (m.joinRequests || []).filter(
            (r) => r.id !== requestId
          ),
        };
      }
      return m;
    });

    localStorage.setItem("matches", JSON.stringify(updatedMatches));

    // Update the match state
    setMatch(updatedMatches.find((m) => m.id === id));
  };

  const handleRemoveOpponent = () => {
    setShowConfirmModal({
      visible: true,
      type: "removeOpponent",
      title: "Remove Opponent",
      message: "Are you sure you want to remove the opponent from this match?",
    });
  };

  const confirmRemoveOpponent = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          hasOpponent: false,
          opponentId: null,
          opponentName: null,
        };
      }
      return m;
    });

    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    setShowConfirmModal({
      visible: false,
      type: "",
      requestId: null,
      title: "",
      message: "",
    });

    // Update the match state
    setMatch(updatedMatches.find((m) => m.id === id));
  };

  // Add the handleLeaveMatch function
  const handleLeaveMatch = () => {
    setShowConfirmModal({
      visible: true,
      type: "leaveMatch",
      title: "Leave Match",
      message:
        "Are you sure you want to leave this match? You'll need to request to join again if you change your mind.",
    });
  };

  // Add the confirmLeaveMatch function
  const confirmLeaveMatch = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.map((m) => {
      if (m.id === id) {
        // If user is the opponent, remove them
        if (m.opponentId === user.id) {
          return {
            ...m,
            hasOpponent: false,
            opponentId: null,
            opponentName: null,
          };
        }

        // If user is in participants, remove them
        if (m.participants) {
          return {
            ...m,
            participants: m.participants.filter((p) => p.userId !== user.id),
          };
        }

        // If user is in joinRequests, remove them
        if (m.joinRequests) {
          return {
            ...m,
            joinRequests: m.joinRequests.filter(
              (r) => r.userId !== user.id || r.id !== user.id
            ),
          };
        }
      }
      return m;
    });

    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    setShowConfirmModal({
      visible: false,
      type: "",
      requestId: null,
      title: "",
      message: "",
    });

    // Navigate away after leaving
    navigate("/matches");
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
        delay: i * 0.1,
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

  const tabVariants = {
    inactive: {
      opacity: 0.7,
      y: 0,
    },
    active: {
      opacity: 1,
      y: 0,
      color: "#4de840",
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      opacity: 1,
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
            className="w-16 h-16 border-4 border-[#4de840] border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-[#fffce1]/70 text-lg"
          >
            Loading match details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/matches")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to matches"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[30px] overflow-hidden mb-8 shadow-xl"
      >
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gradient-to-br from-[#171717] to-[#0e100f]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e100f] via-[#0e100f]/60 to-transparent"></div>

          {/* Match status badge */}
          <div className="absolute top-6 right-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border backdrop-blur-sm ${
                isMatchPast(match.date)
                  ? "bg-gray-500/20 text-gray-400 border-gray-500/20"
                  : "bg-[#4de840]/20 text-[#4de840] border-[#4de840]/20"
              }`}
            >
              {isMatchPast(match.date) ? "Completed" : "Upcoming"}
            </motion.span>
          </div>

          {/* Match info overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#fffce1] mb-4 drop-shadow-lg text-center">
              {match.title || "Football Match"}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#4de840] mr-2"
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
                <span className="text-[#fffce1]">
                  Created by: {match.creatorName || "Unknown"}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#4de840] mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[#fffce1]">{formatDate(match.date)}</span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#4de840] mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[#fffce1]">
                  {match.city || "Not specified"}
                  {match.stadiumName ? `, ${match.stadiumName}` : ""}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {isCreator && (!match.date || !isMatchPast(match.date)) && (
                <>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Link
                      to={`/matches/edit/${match.id}`}
                      className="px-5 py-2.5 bg-[rgb(25,25,25)] border-2 border-white/10 text-[#fffce1] rounded-full hover:border-[#4de840]/30 transition-all duration-300 flex items-center justify-center hover:bg-[rgb(26,26,26)]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit Match
                    </Link>
                  </motion.div>

                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={handleDeleteMatch}
                    className="px-5 py-2.5 bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Match
                  </motion.button>
                </>
              )}

              {/* Leave Match Button */}
              {isParticipant && !isCreator && !isMatchPast(match.date) && (
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleLeaveMatch}
                  className="px-5 py-2.5 bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Leave Match
                </motion.button>
              )}

              {/* Join as Opponent Button */}
              {!isCreator &&
                !match.hasOpponent &&
                !hasRequestedToJoin &&
                !isMatchPast(match.date) && (
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={handleJoinRequest}
                    className="px-5 py-2.5 bg-[#4de840]/10 text-[#4de840] border-2 border-[#4de840]/20 rounded-full hover:bg-[#4de840]/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Join as Opponent
                  </motion.button>
                )}

              {/* Cancel Request Button */}
              {!isCreator && hasRequestedToJoin && !isMatchPast(match.date) && (
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleCancelRequest}
                  className="px-5 py-2.5 bg-amber-500/10 text-amber-400 border-2 border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel Request
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Tabs */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2 pt-1 pl-1">
          <motion.button
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("details")}
            className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === "details"
                ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
            }`}
          >
            Match Details
          </motion.button>

          {isCreator && (
            <motion.button
              variants={tabVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("requests")}
              className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeTab === "requests"
                  ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                  : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
              }`}
            >
              Join Requests
              {match.joinRequests && match.joinRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-[#4de840] text-[#0e100f] text-xs rounded-full font-bold">
                  {match.joinRequests.length}
                </span>
              )}
            </motion.button>
          )}

          <motion.button
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("about")}
            className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === "about"
                ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
            }`}
          >
            About Match
          </motion.button>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Match Information
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-[#fffce1]/70">Date & Time:</div>
                </div>
                <div className="font-medium text-[#fffce1] ml-10">
                  {formatDate(match.date)}
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-[#fffce1]/70">Stadium:</div>
                </div>
                <div className="font-medium text-[#fffce1] ml-10">
                  {match.stadiumName || "Not specified"}
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-[#fffce1]/70">City:</div>
                </div>
                <div className="font-medium text-[#fffce1] ml-10">
                  {match.city || "Not specified"}
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-[#fffce1]/70">Contact:</div>
                </div>
                <div className="font-medium text-[#fffce1] ml-10">
                  {match.contactPhone || "Not provided"}
                </div>
              </motion.div>
            </div>

            {/* Opponent Section */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h2 className="text-xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
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
                Opponent
              </h2>
              <div className="bg-[#1a1a1a]/40 rounded-xl p-5 border border-white/5">
                {match.hasOpponent ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] text-xl font-bold mr-4">
                        {match.opponentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-lg font-medium text-[#fffce1]">
                          {match.opponentName}
                        </div>
                        <div className="text-sm text-[#fffce1]/60">
                          Opponent Team
                        </div>
                      </div>
                    </div>
                    {isCreator && !isMatchPast(match.date) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveOpponent}
                        className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-medium hover:bg-rose-500/20 transition-all duration-300 cursor-pointer"
                      >
                        Remove
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <p className="text-[#fffce1]/70 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-[#4de840]/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {isCreator
                      ? "No opponent yet. Waiting for join requests."
                      : hasRequestedToJoin
                      ? "Your request to join as opponent is pending."
                      : "This match is looking for an opponent."}
                  </p>
                )}
              </div>
            </motion.div>

            {match.notes && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h2 className="text-xl font-bold mb-4 text-[#fffce1] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Notes
                </h2>
                <div className="bg-[#1a1a1a]/40 rounded-xl p-5 border border-white/5">
                  <p className="text-[#fffce1]/80 leading-relaxed">
                    {match.notes}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "requests" && isCreator && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Join Requests
              </h2>
            </motion.div>

            {!match.joinRequests || match.joinRequests.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/20 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-2 text-[#fffce1]">
                  No pending requests
                </h3>
                <p className="text-[#fffce1]/70">
                  There are no pending join requests at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {match.joinRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="rounded-xl p-4 border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] text-xl font-bold mr-4">
                          {request.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-lg font-medium text-[#fffce1]">
                            {request.username}
                          </div>
                          <div className="text-sm text-[#fffce1]/60">
                            Requested:{" "}
                            {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-16 sm:ml-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-4 py-2 bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20 rounded-full text-sm font-medium hover:bg-[#4de840]/20 transition-all duration-300 cursor-pointer"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectRequest(request.id)}
                          className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-sm font-medium hover:bg-rose-500/20 transition-all duration-300 cursor-pointer"
                        >
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About This Match
              </h2>
              <p className="text-[#fffce1]/80 leading-relaxed text-lg">
                {match.description ||
                  match.notes ||
                  "No additional information available for this match."}
              </p>
            </motion.div>

            {match.contactPhone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-[#fffce1] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Contact Information
                </h2>
                <div className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center">
                    <span className="text-[#fffce1]/80 font-medium">
                      Phone:{" "}
                      <span className="text-[#4de840]">
                        {match.contactPhone}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#4de840]/10 rounded-2xl p-5 border border-[#4de840]/20"
            >
              <h3 className="text-lg font-semibold mb-3 text-[#4de840]">
                Match Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#fffce1]/50 text-xs">Status</p>
                    <p className="text-[#fffce1]">
                      {isMatchPast(match.date) ? "Completed" : "Upcoming"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
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
                  </div>
                  <div>
                    <p className="text-[#fffce1]/50 text-xs">Opponent</p>
                    <p className="text-[#fffce1]">
                      {match.hasOpponent ? "Confirmed" : "Needed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
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
                  </div>
                  <div>
                    <p className="text-[#fffce1]/50 text-xs">Creator</p>
                    <p className="text-[#fffce1]">
                      {match.creatorName || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#4de840]/20 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#fffce1]/50 text-xs">
                      Pending Requests
                    </p>
                    <p className="text-[#fffce1]">
                      {match.joinRequests ? match.joinRequests.length : 0}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal.visible && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() =>
                setShowConfirmModal({
                  visible: false,
                  type: "",
                  requestId: null,
                  title: "",
                  message: "",
                })
              }
            ></motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0e100f]/90 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-6 max-w-md w-full z-50"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showConfirmModal.type === "deleteMatch" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    ) : showConfirmModal.type === "leaveMatch" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                      />
                    )}
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#fffce1]">
                  {showConfirmModal.title}
                </h2>
              </div>
              <p className="text-[#fffce1]/70 mb-6">
                {showConfirmModal.message}
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={() =>
                    setShowConfirmModal({
                      visible: false,
                      type: "",
                      requestId: null,
                      title: "",
                      message: "",
                    })
                  }
                  className="px-4 py-2 bg-[#171717]/60 border-2 border-white/10 text-[#fffce1] rounded-full hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[rgb(25,25,25)]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={() => {
                    if (showConfirmModal.type === "deleteMatch") {
                      confirmDeleteMatch();
                    } else if (showConfirmModal.type === "removeOpponent") {
                      confirmRemoveOpponent();
                    } else if (showConfirmModal.type === "leaveMatch") {
                      confirmLeaveMatch();
                    }
                  }}
                  className="px-4 py-2 bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 cursor-pointer"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MatchDetail;
