"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
import {
  checkAndUpdateExpiredReservations,
  calculatePaymentTimeRemaining,
} from "../utils/reservationUtils";

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  const [activeTab, setActiveTab] = useState("all"); // all, active, completed
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  // Function to handle accepting a reservation and setting the expiry time
  const updateReservationWithAcceptedTime = (reservation) => {
    // If the reservation is accepted but doesn't have an acceptedAt timestamp
    if (reservation.status === "accepted" && !reservation.acceptedAt) {
      // Set the acceptedAt timestamp to now
      reservation.acceptedAt = new Date().getTime();

      // Update the reservation in localStorage
      const allReservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const updatedReservations = allReservations.map((r) =>
        r.id === reservation.id
          ? { ...r, acceptedAt: reservation.acceptedAt }
          : r
      );
      localStorage.setItem("reservations", JSON.stringify(updatedReservations));
    }
    return reservation;
  };

  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  // Modify the useEffect hook to properly filter out deleted reservations
  useEffect(() => {
    // Check for expired reservations first
    const hasUpdates = checkAndUpdateExpiredReservations();

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );

    // Filter to only show the current user's reservations that are NOT deleted
    let userReservations = allReservations.filter(
      (r) => r.userId === user.id && !r.deleted_by_user
    );

    // Process each reservation to ensure acceptedAt is set for accepted reservations
    userReservations = userReservations.map(updateReservationWithAcceptedTime);

    // Sort by creation date (newest first)
    userReservations.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setReservations(userReservations);

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);

    // Initialize countdowns for accepted reservations
    const initialCountdowns = {};
    userReservations.forEach((reservation) => {
      if (reservation.status === "accepted") {
        initialCountdowns[reservation.id] =
          calculatePaymentTimeRemaining(reservation);
      }
    });
    setCountdowns(initialCountdowns);

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const updatedCountdowns = { ...prevCountdowns };
        let hasUpdates = false;

        Object.keys(updatedCountdowns).forEach((id) => {
          if (updatedCountdowns[id] > 0) {
            updatedCountdowns[id] -= 1;
            hasUpdates = true;
          } else if (updatedCountdowns[id] === 0) {
            // When countdown reaches zero, check if we need to auto-reject
            const reservation = userReservations.find((r) => r.id === id);
            if (reservation && reservation.status === "accepted") {
              checkAndUpdateExpiredReservations();
            }
          }
        });

        return hasUpdates ? updatedCountdowns : prevCountdowns;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user.id]);

  const handleDeleteReservation = (reservationId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage

    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );

    // Instead of filtering out the reservation, mark it as deleted by user
    const updatedReservations = allReservations.map((reservation) => {
      if (reservation.id === reservationId) {
        return {
          ...reservation,
          status: reservation.status, // Keep the original status
          deleted_by_user: true, // Add this flag
          deletedAt: new Date().getTime(),
        };
      }
      return reservation;
    });

    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    // Update state - only filter for the user's view
    setReservations(reservations.filter((r) => r.id !== reservationId));
    setShowDeleteConfirm(null);
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
      case "payment_waiting":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "payment_rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
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
      case "payment_waiting":
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "payment_rejected":
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
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTimeSlots = (timeSlots) => {
    return timeSlots
      .map((slotId) => {
        const [start, end] = slotId.split("-");
        return `${start}:00-${end}:00`;
      })
      .join(", ");
  };

  // Filter reservations based on active tab
  const filteredReservations = reservations.filter((reservation) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") {
      return ["waiting", "accepted", "payment_waiting"].includes(
        reservation.status
      );
    }
    if (activeTab === "completed") {
      return ["paid", "rejected", "payment_rejected"].includes(
        reservation.status
      );
    }
    return true;
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
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const toggleCardExpansion = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-center text-[#fffce1]"
      >
        My Reservations
      </motion.h1>

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
            className="w-12 h-12 border-4 border-[#4de840] border-t-transparent rounded-full"
          ></motion.div>
        </motion.div>
      ) : reservations.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-16 bg-[#171717]/60 backdrop-blur-[10px] border border-white/15 rounded-[20px] shadow-lg"
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-3 text-[#fffce1]">
            No reservations found
          </h2>
          <p className="text-[#fffce1]/70 max-w-md mx-auto mb-8">
            You haven't made any reservations yet. Start by reserving a stadium
            for your next game!
          </p>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className="inline-block"
          >
            <Link
              to="/reserve"
              className="px-8 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300"
            >
              Make a Reservation
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <>
          {/* Filter tabs */}
          <motion.div
            variants={itemVariants}
            className="mb-8 flex justify-center"
          >
            <div className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-1 inline-flex">
              <motion.button
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#4de840]/10 text-[#4de840] duration-300 transition-all"
                    : "text-[#fffce1]/70 hover:text-[#fffce1] duration-300 transition-all"
                }`}
              >
                All Reservations
              </motion.button>
              <motion.button
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab("active")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "active"
                    ? "bg-[#4de840]/10 text-[#4de840] duration-300 transition-all"
                    : "text-[#fffce1]/70 hover:text-[#fffce1] duration-300 transition-all"
                }`}
              >
                Active
              </motion.button>
              <motion.button
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab("completed")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "completed"
                    ? "bg-[#4de840]/10 text-[#4de840] duration-300 transition-all"
                    : "text-[#fffce1]/70 hover:text-[#fffce1] duration-300 transition-all"
                }`}
              >
                Completed
              </motion.button>
            </div>
          </motion.div>

          {/* Reservations list */}
          <AnimatePresence>
            {filteredReservations.length === 0 ? (
              <motion.div
                key="no-filtered"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-10 bg-[#171717]/60 backdrop-blur-[10px] border border-white/15 rounded-[20px] shadow-lg"
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <h2 className="text-xl font-bold mb-2 text-[#fffce1]">
                  No {activeTab} reservations found
                </h2>
                <p className="text-[#fffce1]/70 max-w-md mx-auto">
                  {activeTab === "active"
                    ? "You don't have any active reservations at the moment."
                    : activeTab === "completed"
                    ? "You don't have any completed reservations yet."
                    : "No reservations match the current filter."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredReservations.map((reservation, index) => (
                  <motion.div
                    key={reservation.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden hover:border-[#4de840]/30 transition-all duration-300"
                  >
                    {/* Main card content */}
                    <div className="relative">
                      {/* Stadium image with overlay */}
                      <div className="relative h-40 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          src={
                            reservation.stadiumImage ||
                            `https://source.unsplash.com/random/300x200/?football,stadium&sig=${
                              reservation.id || "/placeholder.svg"
                            }`
                          }
                          alt={reservation.stadiumName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://source.unsplash.com/random/300x200/?football,stadium&sig=${Math.random()}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        {/* Price badge */}
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-[#4de840] text-[#0e100f] px-3 py-1 rounded-full text-sm font-bold">
                            {reservation.hourlyRate ||
                              reservation.totalPrice /
                                reservation.timeSlots.length}{" "}
                            AZN/hour
                          </div>
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h2 className="text-xl font-bold text-[#fffce1]">
                              {reservation.stadiumName}
                            </h2>
                            <div className="flex items-center mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-[#4de840] mr-1"
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
                              <span className="text-[#fffce1]/80 text-sm">
                                {reservation.city}
                              </span>
                            </div>
                          </div>

                          {/* Status badges */}
                          <div className="flex flex-wrap gap-1 justify-end">
                            {reservation.status === "waiting" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  "waiting"
                                )} flex items-center`}
                              >
                                {getStatusIcon("waiting")}
                                Waiting
                              </span>
                            )}
                            {reservation.status === "accepted" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  "accepted"
                                )} flex items-center`}
                              >
                                {getStatusIcon("accepted")}
                                Accepted
                              </span>
                            )}
                            {reservation.status === "rejected" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  "rejected"
                                )} flex items-center`}
                              >
                                {getStatusIcon("rejected")}
                                Rejected
                              </span>
                            )}
                            {reservation.status === "paid" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  "paid"
                                )} flex items-center`}
                              >
                                {getStatusIcon("paid")}
                                Paid
                              </span>
                            )}
                            {reservation.status === "payment_waiting" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  "payment_waiting"
                                )} flex items-center`}
                              >
                                {getStatusIcon("payment_waiting")}
                                Payment
                              </span>
                            )}
                            {reservation.status === "payment_rejected" && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  "payment_rejected"
                                )} flex items-center`}
                              >
                                {getStatusIcon("payment_rejected")}
                                Payment Failed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Basic info */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#4de840] mr-1"
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
                            <span className="text-[#fffce1]/80 text-sm">
                              {reservation.date}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#4de840] mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-[#4de840] font-medium">
                              {reservation.totalPrice} AZN
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center">
                          <motion.button
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={() => toggleCardExpansion(reservation.id)}
                            className="px-3 py-1.5 bg-[rgb(25,25,25)] border-2 border-white/10 text-[#fffce1] rounded-full hover:border-[#4de840]/30 transition-all duration-300 text-sm flex items-center hover:bg-[rgb(26,26,26)] cursor-pointer"
                          >
                            {expandedCard === reservation.id ? (
                              <>
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
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                                Hide Details
                              </>
                            ) : (
                              <>
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
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                                Show Details
                              </>
                            )}
                          </motion.button>

                          <motion.div
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                          >
                            <Link
                              to={`/stadiums/${reservation.stadiumId}`}
                              className="px-3 py-1.5 bg-[rgb(25,25,25)] border-2 border-white/10 text-[#fffce1] rounded-full hover:border-[#4de840]/30 transition-all duration-300 text-sm flex items-center hover:bg-[rgb(26,26,26)]"
                            >
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
                      </div>
                    </div>

                    {/* Expandable details section */}
                    <AnimatePresence>
                      {expandedCard === reservation.id && (
                        <motion.div
                          key={`details-${reservation.id}`}
                          variants={detailsVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="border-t border-white/10 overflow-hidden"
                        >
                          <div className="p-4">
                            {/* Time slots */}
                            <div className="mb-3">
                              <div className="text-sm text-[#fffce1]/50 mb-1">
                                Time Slots:
                              </div>
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {formatTimeSlots(reservation.timeSlots)}
                              </div>
                            </div>

                            {/* Reservation ID */}
                            <div className="mb-4">
                              <div className="text-sm text-[#fffce1]/50 mb-1">
                                Reservation ID:
                              </div>
                              <div className="font-medium text-xs text-[#fffce1]/70 truncate max-w-full flex items-center">
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
                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                  />
                                </svg>
                                {reservation.id}
                              </div>
                            </div>

                            {/* Action buttons based on status */}
                            {reservation.status === "accepted" && (
                              <div className="mt-2">
                                <div className="flex flex-wrap justify-between gap-3 items-center mb-2">
                                  <div className="text-amber-400 text-sm bg-amber-500/10 px-3 py-1.5 rounded-full flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1.5"
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
                                    Check email to verify payment
                                  </div>
                                  <motion.div
                                    whileHover={
                                      countdowns[reservation.id] > 0
                                        ? { scale: 1.05 }
                                        : {}
                                    }
                                    whileTap={
                                      countdowns[reservation.id] > 0
                                        ? { scale: 0.95 }
                                        : {}
                                    }
                                  >
                                    <Link
                                      to={`/payment/${reservation.id}`}
                                      className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center ${
                                        countdowns[reservation.id] > 0
                                          ? "bg-[#4de840] text-[#0e100f] hover:bg-[#4de840]/90"
                                          : "bg-[#0e100f]/50 text-[#fffce1]/30 border border-white/10 cursor-not-allowed"
                                      }`}
                                      onClick={(e) => {
                                        if (countdowns[reservation.id] <= 0) {
                                          e.preventDefault();
                                        }
                                      }}
                                    >
                                      <span>Go to Payment (Demo)</span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                      </svg>
                                    </Link>
                                  </motion.div>
                                </div>
                                {countdowns[reservation.id] !== undefined && (
                                  <div className="text-xs text-amber-400 mt-2 self-end bg-amber-500/10 px-3 py-1 rounded-full inline-flex items-center">
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
                                    Payment active for:{" "}
                                    {formatTime(countdowns[reservation.id])}
                                  </div>
                                )}
                              </div>
                            )}

                            {(reservation.status === "waiting" ||
                              reservation.status === "rejected" ||
                              reservation.status === "payment_rejected") && (
                              <>
                                {showDeleteConfirm === reservation.id ? (
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm text-rose-400">
                                      Confirm deletion?
                                    </span>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        handleDeleteReservation(reservation.id)
                                      }
                                      className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 flex items-center text-sm cursor-pointer"
                                    >
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
                                      Yes
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setShowDeleteConfirm(null)}
                                      className="px-3 py-1.5 bg-[#0e100f]/50 text-[#fffce1]/70 border border-white/10 rounded-full hover:bg-[#0e100f]/70 transition-all duration-300 flex items-center text-sm cursor-pointer"
                                    >
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
                                      No
                                    </motion.button>
                                  </div>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      setShowDeleteConfirm(reservation.id)
                                    }
                                    className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 flex items-center text-sm mt-2 cursor-pointer"
                                  >
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Delete Reservation
                                  </motion.button>
                                )}
                              </>
                            )}

                            {reservation.status === "paid" && (
                              <div className="text-sm text-[#4de840] bg-[#4de840]/10 px-4 py-2 rounded-full flex items-center mt-2">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Your reservation is confirmed
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default MyReservations;
