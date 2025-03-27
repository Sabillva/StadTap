"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { AuthContext } from "../App"
import { getStadiumByName } from "../utils/stadiumUtils" // Import the utility function

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState([])
  const [reservations, setReservations] = useState([])
  const [userTeams, setUserTeams] = useState([])
  const [userMatches, setUserMatches] = useState([])
  const [userReservations, setUserReservations] = useState([])
  const [userStadium, setUserStadium] = useState(null) // Add state for the user's stadium

  useEffect(() => {
    // Load user data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = storedUsers.find((u) => u.id === id)

    if (!foundUser) {
      navigate("/users")
      return
    }

    setUser(foundUser)

    // If user is a stadium owner, get their stadium data
    if (foundUser.userType === "owner" && foundUser.stadiumName) {
      // Use the utility function to get stadium by name
      const stadium = getStadiumByName(foundUser.stadiumName)
      setUserStadium(stadium)
    }

    // Get user's teams
    const storedTeams = localStorage.getItem("teams")
    const allTeams = storedTeams ? JSON.parse(storedTeams) : []
    const userTeams = allTeams.filter(
      (team) =>
        team.members.some((member) => {
          if (typeof member === "object") {
            return member.id === id
          }
          return member === id
        }) || team.creatorId === id,
    )
    setTeams(userTeams)
    setUserTeams(userTeams)

    // Get user's matches
    const storedMatches = localStorage.getItem("matches")
    const allMatches = storedMatches ? JSON.parse(storedMatches) : []

    // Filter matches where user is creator, opponent, or participant
    const userMatches = allMatches.filter((match) => {
      const isCreator = match.creatorId === id
      const isOpponent = match.opponentId === id
      const isParticipant = match.participants && match.participants.some((p) => p.userId === id)
      const isInJoinRequests =
        match.joinRequests &&
        match.joinRequests.some((request) => request.userId === id && request.status === "accepted")

      return isCreator || isOpponent || isParticipant || isInJoinRequests
    })

    setUserMatches(userMatches)

    // Get user's reservations
    const storedReservations = localStorage.getItem("reservations")
    const allReservations = storedReservations ? JSON.parse(storedReservations) : []
    const userReservations = allReservations.filter((r) => r.userId === id && !r.deleted_by_user)
    setReservations(userReservations)
    setUserReservations(userReservations)

    // For stadium owners, get their stadium's reservations
    if (foundUser.userType === "owner" && foundUser.stadiumName) {
      const storedReservations = localStorage.getItem("reservations")
      const allReservations = storedReservations ? JSON.parse(storedReservations) : []
      // Filter to only show public reservations for this stadium
      const stadiumReservations = allReservations
        .filter((r) => r.stadiumName === foundUser.stadiumName && r.status === "paid")
        .slice(0, 3)
      setReservations(stadiumReservations)
    }

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [id, navigate])

  const handleSendMessage = () => {
    navigate(`/chat/${id}`)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

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
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
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
            Loading user profile...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container mx-auto px-4 py-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>

        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(#4de840 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      {/* Floating back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/users")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to users"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden mb-8"
        >
          <div className="relative">
            {/* Profile banner */}
            <div className="h-32 bg-gradient-to-r from-[#0e100f] via-[#1a1f1a] to-[#0e100f] relative overflow-hidden">
              <div className="absolute inset-0">
                <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
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
                    backgroundImage: "radial-gradient(#4de840 1px, transparent 1px)",
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
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <button
                    onClick={handleSendMessage}
                    className="px-5 py-2.5 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center cursor-pointer"
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Send Message
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Information */}
          <motion.div variants={itemVariants}>
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User Information
            </motion.h2>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-[#fffce1]/50 mb-1">Email Address:</div>
                  <div className="font-medium text-[#fffce1] flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {user.email}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#fffce1]/50 mb-1">User Type:</div>
                  <div className="font-medium text-[#fffce1] flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-[#4de840]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {user.userType === "owner" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      )}
                    </svg>
                    {user.userType === "owner" ? "Stadium Owner" : "Player"}
                  </div>
                </div>

                {user.userType === "owner" && user.stadiumName && (
                  <div>
                    <div className="text-sm text-[#fffce1]/50 mb-1">Stadium:</div>
                    <div className="font-medium text-[#fffce1] flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-[#4de840]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      {user.stadiumName}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Teams Section */}
            {teams.length > 0 && (
              <>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Teams
                </motion.h2>

                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
                >
                  <ul className="divide-y divide-white/10">
                    {teams.map((team, index) => (
                      <motion.li
                        key={team.id}
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
                                <h3 className="text-lg font-medium text-[#fffce1]">{team.name}</h3>
                                <p className="text-sm text-[#fffce1]/70">{team.members?.length || 0} members</p>
                              </div>
                            </div>
                            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
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
                </motion.div>
              </>
            )}

            {/* Matches Section */}
            {userMatches.length > 0 && (
              <>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Matches
                </motion.h2>

                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
                >
                  <ul className="divide-y divide-white/10">
                    {userMatches.map((match, index) => (
                      <motion.li
                        key={match.id}
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-[#fffce1]">
                                  {match.title || "Football Match"}
                                </h3>
                                <p className="text-sm text-[#fffce1]/70">
                                  {match.date ? new Date(match.date).toLocaleDateString() : "Date not specified"}
                                  {match.city ? ` • ${match.city}` : ""}
                                </p>
                              </div>
                            </div>
                            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
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
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Stadium Information (for owners) */}
          {user.userType === "owner" && user.stadiumName && (
            <motion.div variants={itemVariants}>
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Stadium Information
              </motion.h2>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    src={
                      userStadium?.image ||
                      `https://source.unsplash.com/random/800x400/?football,stadium&sig=${user.id || Math.random()}`
                    }
                    alt={user.stadiumName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://source.unsplash.com/random/800x400/?football,stadium&sig=${Math.random()}`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{user.stadiumName}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-[#fffce1]/50 mb-1">About:</div>
                    <p className="text-[#fffce1]/80">
                      {userStadium?.description ||
                        `${user.stadiumName} is a modern football stadium managed by ${user.firstName} ${user.lastName}. Contact for reservations and more information.`}
                    </p>
                  </div>

                  {reservations.length > 0 && (
                    <div>
                      <div className="text-sm text-[#fffce1]/50 mb-2">Recent Reservations:</div>
                      <ul className="space-y-2">
                        {reservations.map((reservation) => (
                          <li
                            key={reservation.id}
                            className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 flex justify-between items-center"
                          >
                            <div>
                              <div className="text-[#fffce1] font-medium">{reservation.date}</div>
                              <div className="text-[#fffce1]/60 text-sm">
                                {reservation.timeSlots
                                  .map((slotId) => {
                                    const [start, end] = slotId.split("-")
                                    return `${start}:00-${end}:00`
                                  })
                                  .join(", ")}
                              </div>
                            </div>
                            <div className="bg-[#4de840]/10 text-[#4de840] px-2 py-1 rounded-full text-xs border border-[#4de840]/20">
                              Booked
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants} className="mt-6">
                    <Link
                      to={userStadium ? `/stadiums/${userStadium.id}` : `/stadiums`}
                      className="w-full text-center bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center justify-center"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Stadium
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Additional Information for Players */}
          {user.userType !== "owner" && (
            <motion.div variants={itemVariants}>
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
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Player Statistics
              </motion.h2>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-[#4de840] text-2xl font-bold mb-1">{userTeams.length}</div>
                      <div className="text-[#fffce1]/70 text-sm">Teams</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-[#4de840] text-2xl font-bold mb-1">{userMatches.length}</div>
                      <div className="text-[#fffce1]/70 text-sm">Matches</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-[#4de840] text-2xl font-bold mb-1">{userReservations.length}</div>
                      <div className="text-[#fffce1]/70 text-sm">Reservations</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-[#fffce1]/50 mb-1">Player Bio:</div>
                    <p className="text-[#fffce1]/80">
                      {user.bio ||
                        `${user.firstName} is an active player on our platform. They have joined ${userTeams.length} teams and participated in ${userMatches.length} matches.`}
                    </p>
                  </div>

                  {teams.length > 0 && (
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants} className="mt-6">
                      <Link
                        to="/teams"
                        className="w-full text-center bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center justify-center"
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
                        View Teams
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UserDetail

