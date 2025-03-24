"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasRequestedToJoin, setHasRequestedToJoin] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [showConfirmModal, setShowConfirmModal] = useState({
    visible: false,
    type: "",
    memberId: null,
    title: "",
    message: "",
  });

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = storedTeams ? JSON.parse(storedTeams) : [];
    const foundTeam = teams.find((t) => t.id === id);

    if (!foundTeam) {
      navigate("/teams");
      return;
    }

    setTeam(foundTeam);
    setIsCreator(foundTeam.creatorId === user.id);
    setIsMember(foundTeam.members.some((member) => member.id === user.id));
    setHasRequestedToJoin(
      foundTeam.joinRequests.some((request) => request.id === user.id)
    );

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [id, navigate, user.id]);

  const handleJoinRequest = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          joinRequests: [
            ...t.joinRequests,
            {
              id: user.id,
              username: user.username,
              requestDate: new Date().toISOString(),
              status: "pending",
            },
          ],
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setHasRequestedToJoin(true);
  };

  const handleCancelRequest = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          joinRequests: t.joinRequests.filter(
            (request) => request.id !== user.id
          ),
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setHasRequestedToJoin(false);
  };

  const handleRemoveMember = (memberId) => {
    setShowConfirmModal({
      visible: true,
      type: "removeMember",
      memberId: memberId,
      title: "Remove Member",
      message: "Are you sure you want to remove this member from the team?",
    });
  };

  const confirmRemoveMember = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          members: t.members.filter(
            (member) => member.id !== showConfirmModal.memberId
          ),
          memberCount: t.memberCount - 1,
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeam(updatedTeams.find((t) => t.id === id));
    setShowConfirmModal({
      visible: false,
      type: "",
      memberId: null,
      title: "",
      message: "",
    });
  };

  const handleDeleteTeam = () => {
    setShowConfirmModal({
      visible: true,
      type: "deleteTeam",
      title: "Delete Team",
      message:
        "Are you sure you want to delete this team? This action cannot be undone and all team data will be permanently removed.",
    });
  };

  const confirmDeleteTeam = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.filter((t) => t.id !== id);

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setShowConfirmModal({
      visible: false,
      type: "",
      memberId: null,
      title: "",
      message: "",
    });
    navigate("/teams");
  };

  const handleLeaveTeam = () => {
    setShowConfirmModal({
      visible: true,
      type: "leaveTeam",
      title: "Leave Team",
      message:
        "Are you sure you want to leave this team? You'll need to request to join again if you change your mind.",
    });
  };

  const confirmLeaveTeam = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          members: t.members.filter((member) => member.id !== user.id),
          memberCount: t.memberCount - 1,
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setShowConfirmModal({
      visible: false,
      type: "",
      memberId: null,
      title: "",
      message: "",
    });
    navigate("/teams");
  };

  const handleAcceptRequest = (requestId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        const request = t.joinRequests.find((r) => r.id === requestId);
        return {
          ...t,
          members: [
            ...t.members,
            {
              id: request.id,
              username: request.username,
              status: "accepted",
              joinDate: new Date().toISOString(),
            },
          ],
          joinRequests: t.joinRequests.filter((r) => r.id !== requestId),
          memberCount: t.memberCount + 1,
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeam(updatedTeams.find((t) => t.id === id));
  };

  const handleRejectRequest = (requestId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          joinRequests: t.joinRequests.filter((r) => r.id !== requestId),
        };
      }
      return t;
    });
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeam(updatedTeams.find((t) => t.id === id));
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
      boxShadow: "0 1px 2px -5px rgba(77, 232, 64, 0.1)",
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
            Loading team details...
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
        onClick={() => navigate("/teams")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to teams"
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

          {/* Team logo and info overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {team.joinRequests.length > 0 && isCreator && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 right-6"
              ></motion.div>
            )}
          </div>

          {/* Team info overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#fffce1] mb-4 drop-shadow-lg text-center">
              {team.name}
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
                  Created by: {team.creatorName}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-[#fffce1]">
                  {team.memberCount}/{team.maxMembers} Members
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
                <span className="text-[#fffce1]/70">
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {isCreator && (
                <>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Link
                      to={`/teams/edit/${team.id}`}
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
                      Edit Team
                    </Link>
                  </motion.div>

                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={handleDeleteTeam}
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
                    Delete Team
                  </motion.button>
                </>
              )}

              {isMember && !isCreator && (
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleLeaveTeam}
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
                  Leave Team
                </motion.button>
              )}

              {!isMember && !isCreator && !hasRequestedToJoin && (
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleJoinRequest}
                  disabled={team.memberCount >= team.maxMembers}
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    team.memberCount >= team.maxMembers
                      ? "bg-gray-500/20 text-gray-400 border-2 border-gray-500/20 cursor-not-allowed"
                      : "bg-[#4de840]/10 text-[#4de840] border-2 border-[#4de840]/20 hover:bg-[#4de840]/20"
                  }`}
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
                  {team.memberCount >= team.maxMembers
                    ? "Team is Full"
                    : "Request to Join"}
                </motion.button>
              )}

              {!isMember && !isCreator && hasRequestedToJoin && (
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
            onClick={() => setActiveTab("members")}
            className={`px-5 py-3 rounded-full text-[#fffce1] whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === "members"
                ? "bg-[#4de840]/20 border-2 border-[#4de840]/30 text-[#4de840] font-medium"
                : "bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 hover:border-[#4de840]/30"
            }`}
          >
            Members
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
              {team.joinRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-[#4de840] text-[#0e100f] text-xs rounded-full font-bold">
                  {team.joinRequests.length}
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
            About Team
          </motion.button>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "members" && (
          <motion.div
            key="members"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Team Members
              </h2>

              {/* Progress bar for team capacity */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((team.memberCount || team.members?.length || 0) /
                        (team.maxMembers || 10)) *
                      100
                    }%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${
                    team.memberCount >= team.maxMembers
                      ? "bg-rose-400"
                      : "bg-[#4de840]"
                  }`}
                ></motion.div>
              </div>
            </motion.div>

            {team.members.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-2 text-[#fffce1]">
                  No members yet
                </h3>
                <p className="text-[#fffce1]/70">
                  This team doesn't have any members yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] text-xl font-bold mr-4">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-lg font-medium text-[#fffce1]">
                            {member.username}
                          </div>
                          <div className="text-sm text-[#fffce1]/60 flex items-center">
                            {member.id === team.creatorId ? (
                              <span className="flex items-center text-[#4de840]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                                Team Creator
                              </span>
                            ) : (
                              <span>Member</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isCreator && member.id !== user.id && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveMember(member.id)}
                          className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-medium hover:bg-rose-500/20 transition-all duration-300 cursor-pointer"
                        >
                          Remove
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "requests" && (
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

            {team.joinRequests.length === 0 ? (
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
                {team.joinRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className=" rounded-xl p-4 border-white/5 hover:border-[#4de840]/20 transition-colors duration-300"
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
                          className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-sm font-medium hover:bg-rose-500/20 transition-all duration-300 cursor-pointer
                          "
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
                About This Team
              </h2>
              <p className="text-[#fffce1]/80 leading-relaxed text-lg">
                {team.description || "No description available for this team."}
              </p>
            </motion.div>

            {team.phoneNumber && (
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
                      <span className="text-[#4de840]">{team.phoneNumber}</span>
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
                Team Statistics
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#fffce1]/50 text-xs">Members</p>
                    <p className="text-[#fffce1]">
                      {team.memberCount}/{team.maxMembers}
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#fffce1]/50 text-xs">Created</p>
                    <p className="text-[#fffce1]">
                      {new Date(team.createdAt).toLocaleDateString()}
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
                    <p className="text-[#fffce1]">{team.creatorName}</p>
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
                    <p className="text-[#fffce1]">{team.joinRequests.length}</p>
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
                  memberId: null,
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
                    {showConfirmModal.type === "deleteTeam" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    ) : showConfirmModal.type === "leaveTeam" ? (
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
                      memberId: null,
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
                    if (showConfirmModal.type === "deleteTeam") {
                      confirmDeleteTeam();
                    } else if (showConfirmModal.type === "leaveTeam") {
                      confirmLeaveTeam();
                    } else if (showConfirmModal.type === "removeMember") {
                      confirmRemoveMember();
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

export default TeamDetail;
