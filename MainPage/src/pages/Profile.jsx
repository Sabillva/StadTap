"use client";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});
  const navigate = useNavigate();

  // Add a state for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Add state for active tab
  const [activeTab, setActiveTab] = useState("teams");

  // Add a function to handle account deletion
  const handleDeleteAccount = () => {
    // Remove user from localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const updatedUsers = users.filter((u) => u.id !== user.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Clear current user session
    localStorage.removeItem("user");

    // Log out the user
    setUser(null);

    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const userProfile = users.find((u) => u.id === user.id);

    if (userProfile) {
      setProfile(userProfile);
    }

    // Get user's teams - Fix the filtering logic
    try {
      const storedTeams = localStorage.getItem("teams");
      const allTeams = storedTeams ? JSON.parse(storedTeams) : [];

      // More robust filtering to handle different data structures
      const userTeams = allTeams.filter((team) => {
        // Check if user is creator
        if (team.creatorId === user.id) return true;

        // Check if user is a member
        if (team.members && Array.isArray(team.members)) {
          return team.members.some(
            (member) =>
              member &&
              (member.id === user.id ||
                (typeof member === "string" && member === user.id))
          );
        }
        return false;
      });

      setTeams(userTeams);

      // Get user's matches - Fix the filtering logic
      const storedMatches = localStorage.getItem("matches");
      const allMatches = storedMatches ? JSON.parse(storedMatches) : [];

      // More comprehensive filtering for matches
      const userMatches = allMatches
        .filter((match) => {
          // Check if user is the creator
          if (match.creatorId === user.id) return true;

          // Check if user's team is participating
          if (userTeams.length > 0) {
            return userTeams.some(
              (team) =>
                team.id === match.homeTeamId ||
                team.id === match.awayTeamId ||
                team.name === match.homeTeamName ||
                team.name === match.awayTeamName
            );
          }

          // Check if user is directly involved
          return (
            match.opponentId === user.id ||
            match.participants?.includes(user.id)
          );
        })
        .slice(0, 3); // Get only the 3 most recent

      setMatches(userMatches);
    } catch (error) {
      console.error("Error loading teams or matches:", error);
      setTeams([]);
      setMatches([]);
    }

    // Get user's reservations - Fix the filtering logic
    const storedReservations = localStorage.getItem("reservations");
    const allReservations = storedReservations
      ? JSON.parse(storedReservations)
      : [];

    // More robust filtering for reservations
    const userReservations = allReservations
      .filter((r) => {
        // Check if reservation belongs to user and is not deleted
        return (
          (r.userId === user.id ||
            r.username === user.username ||
            r.email === user.email) &&
          !r.deleted_by_user
        );
      })
      .slice(0, 3); // Get only the 3 most recent

    setReservations(userReservations);

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [user.id, navigate, setUser]);

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
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(77, 232, 64, 0.1)",
      borderColor: "rgba(77, 232, 64, 0.3)",
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
  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "accepted":
        return "bg-[#4de840]/10 text-[#4de840] border-[#4de840]/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "paid":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "waiting":
        return (
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "accepted":
        return (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "rejected":
        return (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "paid":
        return (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
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
            Loading your profile...
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

      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden mb-10"
        >
          <div className="relative">
            {/* Profile banner */}
            <div className="h-32 bg-gradient-to-r from-[#0e100f] via-[#1a1f1a] to-[#0e100f] relative overflow-hidden">
              <div className="absolute inset-0">
                <svg
                  viewBox="0 0 800 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-20"
                >
                  <path
                    fill="#4de840"
                    d="M-13.5,95.7 C131.1,152.8 145.9,-73.5 275.3,41.7 C404.7,156.8 497.9,-32.1 638.1,63.5 C778.2,159.1 940.5,-14.9 1047.6,88.6 L1050,218.5 L-13.5,218.5 Z"
                    opacity="0.25"
                  ></path>
                  <path
                    fill="#4de840"
                    d="M-33.5,132.8 C125.4,93.9 145.4,274.9 271.1,188.5 C396.8,102.1 495.3,236.0 637.2,188.5 C779.1,141.0 942.4,226.5 1050.9,169.0 L1078.5,366.5 L-33.5,386.5 Z"
                    opacity="0.25"
                  ></path>
                </svg>
              </div>

              {/* Decorative dots */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(#4de840 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-8 -mt-16 relative">
              {/* Avatar and basic info */}
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-28 h-28 rounded-full border-4 border-[#0e100f] shadow-lg overflow-hidden bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] text-4xl font-bold"
                >
                  {user.firstName.charAt(0)}
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-4xl font-bold text-[#fffce1]"
                  >
                    {user.firstName} {user.lastName}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap items-center gap-3 mt-2"
                  >
                    <span className="text-[#fffce1]/70">@{user.username}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4de840]/50"></span>
                    <span className="text-[#fffce1]/70">{user.email}</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-3"
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-[#4de840]/10 text-[#4de840] border-[#4de840]/20">
                      {user.userType === "owner" ? "Stadium Owner" : "Player"}
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-col space-y-3 mt-4 md:mt-0"
                >
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Link
                      to="/profile/edit"
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
                      Edit Profile
                    </Link>
                  </motion.div>

                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={() => setShowDeleteModal(true)}
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
                    Delete Account
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs for mobile */}
        <motion.div
          variants={itemVariants}
          className="md:hidden mb-6 flex justify-center"
        >
          <div className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-1 inline-flex">
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "teams" ? "active" : "inactive"}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("teams")}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              Teams
            </motion.button>
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "matches" ? "active" : "inactive"}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("matches")}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              Matches
            </motion.button>
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "reservations" ? "active" : "inactive"}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("reservations")}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              Reservations
            </motion.button>
          </div>
        </motion.div>

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teams Section - Always visible on desktop, conditionally on mobile */}
          <motion.div
            variants={itemVariants}
            className={activeTab === "teams" ? "block" : "hidden md:block"}
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold mb-5 text-[#fffce1] flex items-center"
            >
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
              My Teams
            </motion.h2>

            {!teams || teams.length === 0 ? (
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-6 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/30 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-3 text-[#fffce1]">
                  No Teams Yet
                </h3>
                <p className="text-[#fffce1]/70 max-w-md mx-auto mb-6">
                  You haven't joined any teams yet. Create a team to start
                  playing matches with friends!
                </p>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="inline-block"
                >
                  <Link
                    to="/teams/create"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create a Team
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden"
              >
                <ul className="divide-y divide-white/10">
                  {teams.map((team, index) => (
                    <motion.li
                      key={team.id || index}
                      custom={index}
                      variants={cardVariants}
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                      className="transition-colors duration-300"
                    >
                      <Link to={`/teams/${team.id}`} className="block p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] mr-3">
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
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-[#fffce1]">
                                {team.name}
                              </h3>
                              <p className="text-sm text-[#fffce1]/70">
                                {team.members?.length || 0} members
                              </p>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#4de840]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-4 border-t border-white/10">
                  <Link
                    to="/teams"
                    className="text-[#4de840] hover:text-[#4de840]/80 flex items-center justify-center transition-colors duration-300"
                  >
                    View All Teams
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Matches Section - Moved outside of Teams section */}
          <motion.div
            variants={itemVariants}
            className={activeTab === "matches" ? "block" : "hidden md:block"}
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-2xl font-bold mb-5 text-[#fffce1] flex items-center"
            >
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Recent Matches
            </motion.h2>

            {!matches || matches.length === 0 ? (
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-6 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/30 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-3 text-[#fffce1]">
                  No Matches Yet
                </h3>
                <p className="text-[#fffce1]/70 max-w-md mx-auto mb-6">
                  You haven't participated in any matches yet. Create a match to
                  start playing!
                </p>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="inline-block"
                >
                  <Link
                    to="/matches/create"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create a Match
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden"
              >
                <ul className="divide-y divide-white/10">
                  {matches.map((match, index) => (
                    <motion.li
                      key={match.id || index}
                      custom={index}
                      variants={cardVariants}
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                      className="transition-colors duration-300"
                    >
                      <Link to={`/matches/${match.id}`} className="block p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] mr-3">
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
                                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-[#fffce1]">
                                {match.homeTeamName || "Team"} vs{" "}
                                {match.awayTeamName || "Opponent"}
                              </h3>
                              <p className="text-sm text-[#fffce1]/70">
                                {match.date
                                  ? new Date(match.date).toLocaleDateString()
                                  : "Upcoming match"}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#4de840]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-4 border-t border-white/10">
                  <Link
                    to="/matches"
                    className="text-[#4de840] hover:text-[#4de840]/80 flex items-center justify-center transition-colors duration-300"
                  >
                    View All Matches
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Reservations Section */}
          <motion.div
            variants={itemVariants}
            className={
              activeTab === "reservations" ? "block" : "hidden md:block"
            }
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold mb-5 text-[#fffce1] flex items-center"
            >
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Recent Reservations
            </motion.h2>

            {!reservations || reservations.length === 0 ? (
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-6 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/30 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-3 text-[#fffce1]">
                  No Reservations Yet
                </h3>
                <p className="text-[#fffce1]/70 max-w-md mx-auto mb-6">
                  You haven't made any reservations yet. Reserve a stadium for
                  your next game!
                </p>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="inline-block"
                >
                  <Link
                    to="/reserve"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Make a Reservation
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden"
              >
                <ul className="divide-y divide-white/10">
                  {reservations.map((reservation, index) => (
                    <motion.li
                      key={reservation.id || index}
                      custom={index}
                      variants={cardVariants}
                      className="transition-colors duration-300"
                    >
                      <Link to="/my-reservations" className="block p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] mr-3">
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
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-[#fffce1]">
                                {reservation.stadiumName || "Stadium"}
                              </h3>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-[#fffce1]/70">
                                  {reservation.date || "Upcoming"}
                                </p>
                                <span className="w-1 h-1 rounded-full bg-[#4de840]/50"></span>
                                <p className="text-sm text-[#4de840]">
                                  {reservation.totalPrice || "0"} AZN
                                </p>
                              </div>
                              <div className="mt-1">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                    reservation.status || "waiting"
                                  )}`}
                                >
                                  {getStatusIcon(
                                    reservation.status || "waiting"
                                  )}
                                  {reservation.status === "waiting"
                                    ? "Waiting"
                                    : reservation.status === "accepted"
                                    ? "Accepted"
                                    : reservation.status === "rejected"
                                    ? "Rejected"
                                    : reservation.status === "paid"
                                    ? "Paid"
                                    : "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#4de840]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-4 border-t border-white/10">
                  <Link
                    to="/my-reservations"
                    className="text-[#4de840] hover:text-[#4de840]/80 flex items-center justify-center transition-colors duration-300"
                  >
                    View All Reservations
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Stadium Owner Section */}
            {user.userType === "owner" && (
              <motion.div variants={itemVariants}>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-2xl font-bold mb-5 mt-8 text-[#fffce1] flex items-center"
                >
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Stadium Owner
                </motion.h2>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-6"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] mr-4 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#fffce1] mb-2">
                        You are registered as the owner of{" "}
                        <span className="font-semibold text-[#4de840]">
                          {user.stadiumName || "your stadium"}
                        </span>
                      </p>
                      <p className="text-[#fffce1]/70 mb-4">
                        Manage your stadium reservations and requests from the
                        dashboard.
                      </p>
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        className="inline-block"
                      >
                        <Link
                          to="/dashboard"
                          className="px-5 py-2.5 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center"
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
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Go to Dashboard
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#fffce1]">
                  Delete Account
                </h2>
              </div>
              <p className="text-[#fffce1]/70 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-[#171717]/60 border-2 border-white/10 text-[#fffce1] rounded-full hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[rgb(25,25,25)]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 cursor-pointer"
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
