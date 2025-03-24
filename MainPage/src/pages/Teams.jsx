"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const Teams = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const allTeams = storedTeams ? JSON.parse(storedTeams) : [];

    // Sort teams by creation date (newest first)
    allTeams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setTeams(allTeams);

    // Filter teams where user is a member or creator
    const myTeams = allTeams.filter(
      (team) =>
        team.members?.some((member) => {
          if (typeof member === "object") {
            return member.id === user.id;
          }
          return member === user.id;
        }) || team.creatorId === user.id
    );
    setUserTeams(myTeams);

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [user.id]);

  // Filter teams based on search query
  const filteredTeams = (activeTab === "all" ? teams : userTeams).filter(
    (team) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        team.name?.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query) ||
        team.creatorName?.toLowerCase().includes(query)
      );
    }
  );

  // Sort teams based on selected option
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "members":
        return (b.memberCount || 0) - (a.memberCount || 0);
      default:
        return 0;
    }
  });

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
      // borderColor: "rgba(77, 232, 64, 0.3)",
      // scale: 1.01,
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

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        height: {
          duration: 0.2,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.3,
          delay: 0.1,
        },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        opacity: {
          duration: 0.2,
        },
        height: {
          duration: 0.4,
          delay: 0.1,
          ease: "easeInOut",
        },
      },
    },
  };

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

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-[#fffce1]"
        >
          Teams
        </motion.h1>
        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
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
            Create Team
          </Link>
        </motion.div>
      </motion.div>

      {/* Tabs and Search */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-1 inline-flex">
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "all" ? "active" : "inactive"}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("all")}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              All Teams
            </motion.button>
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === "my" ? "active" : "inactive"}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("my")}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              My Teams
            </motion.button>
          </div>

          {/* Add more modern animations to the search input and filter button */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <motion.div
              className="relative flex-1 md:w-64"
              initial={{ opacity: 0, width: "90%" }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
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
              <motion.input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border-2 border-white/10 focus:border-[#4de840]/50 rounded-full text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300"
                whileFocus={{
                  scale: 1.02,
                  borderColor: "rgba(77, 232, 64, 0.5)",
                }}
                transition={{ duration: 0.2 }}
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#fffce1]/50 hover:text-[#fffce1] transition-colors duration-200"
                  onClick={() => setSearchQuery("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                </motion.button>
              )}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: showFilters ? 0 : 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 bg-[#1a1a1a] border-2 cursor-pointer ${
                showFilters
                  ? "border-[#4de840]/50 text-[#4de840]"
                  : "border-white/10 text-[#fffce1]"
              } hover:border-[#4de840]/50 rounded-full focus:outline-none transition-all duration-300`}
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Filter options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-xl p-5 mb-4 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-[#fffce1]/70 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Sort by:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy("newest")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                        sortBy === "newest"
                          ? "bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20"
                          : "bg-[#1a1a1a] text-[#fffce1]/70 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      Newest
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy("oldest")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                        sortBy === "oldest"
                          ? "bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20"
                          : "bg-[#1a1a1a] text-[#fffce1]/70 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      Oldest
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy("name")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                        sortBy === "name"
                          ? "bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20"
                          : "bg-[#1a1a1a] text-[#fffce1]/70 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      Name (A-Z)
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy("members")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                        sortBy === "members"
                          ? "bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20"
                          : "bg-[#1a1a1a] text-[#fffce1]/70 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      Most Members
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSortBy("newest");
                    setSearchQuery("");
                  }}
                  className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-medium transition-all duration-300 hover:bg-rose-500/20 cursor-pointer"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 mr-1"
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
                    Clear Filters
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center h-[60vh]"
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
            className="w-16 h-16 border-4 border-[#4de840] border-t-transparent rounded-full"
          ></motion.div>
        </motion.div>
      ) : activeTab === "all" && teams.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-16 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-3 text-[#fffce1]">
            No teams found
          </h2>
          <p className="text-[#fffce1]/70 max-w-md mx-auto mb-8">
            Be the first to create a team and invite players!
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
      ) : activeTab === "my" && userTeams.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-16 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-3 text-[#fffce1]">
            You're not in any teams
          </h2>
          <p className="text-[#fffce1]/70 max-w-md mx-auto mb-8">
            Create your own team or join an existing one!
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
      ) : filteredTeams.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white/30 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-3 text-[#fffce1]">
            No teams match your search
          </h2>
          <p className="text-[#fffce1]/70 max-w-md mx-auto">
            Try adjusting your search criteria or create a new team
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedTeams.map((team, index) => (
            <motion.div
              key={team.id || index}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden hover:border-[#4de840]/30 transition-all duration-300"
            >
              {/* Team header with gradient */}
              <div className="h-28 bg-gradient-to-r from-[#0e100f] via-[#1a1f1a] to-[#0e100f] relative overflow-hidden">
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

                {/* Team status badge */}
                {team.memberCount >= team.maxMembers && (
                  <div className="absolute top-3 right-3">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs font-medium rounded-full border border-rose-500/20 backdrop-blur-sm"
                    >
                      Full
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Team content */}
              <div className="p-6 relative">
                {/* Team icon - moved inside the content area */}
                <div className="absolute -top-12 left-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-16 h-16 rounded-full border-4 border-[#171717] shadow-lg overflow-hidden bg-gradient-to-br from-[#4de840] to-[#2ca322] flex items-center justify-center text-[#0e100f] text-2xl font-bold"
                  >
                    {team.name?.charAt(0) || "T"}
                  </motion.div>
                </div>

                <div className="ml-20">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl font-bold text-[#fffce1]"
                  >
                    {team.name}
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center mt-1"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#4de840]/10 flex items-center justify-center text-[#4de840] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
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
                    <span className="text-xs text-[#fffce1]/70">
                      Created by:{" "}
                      <span className="text-[#4de840]">{team.creatorName}</span>
                    </span>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-[#fffce1]/70 mt-4 mb-4 line-clamp-2 min-h-[40px]"
                >
                  {team.description || "No description provided."}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex justify-between items-center mb-6 bg-[#1a1a1a]/40 rounded-xl p-3 border border-white/5"
                >
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
                    <span
                      className={`text-[#fffce1]/80 ${
                        team.memberCount >= team.maxMembers
                          ? "text-rose-400 font-bold"
                          : ""
                      }`}
                    >
                      {team.memberCount || team.members?.length || 0}/
                      {team.maxMembers || 10} members
                    </span>
                  </div>

                  {/* Progress bar for team capacity */}
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
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
                          ? "bg-[#4de840]"
                          : "bg-[#4de840]"
                      }`}
                    ></motion.div>
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Link
                    to={`/teams/${team.id}`}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border-2 border-white/10 text-[#fffce1] rounded-full hover:border-[#4de840]/30 transition-all duration-300 flex items-center justify-center hover:bg-[#1a1a1a]/80"
                  >
                    <span>View Team</span>
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Teams;
