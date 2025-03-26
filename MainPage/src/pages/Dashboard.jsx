"use client";

import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
// Import the utility function at the top
import { checkAndUpdateExpiredReservations } from "../utils/reservationUtils";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    paid: 0,
  });

  // Add this to the useEffect in Dashboard
  useEffect(() => {
    // Check for expired reservations first
    checkAndUpdateExpiredReservations();

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedReservations = localStorage.getItem("reservations");
    const allReservations = storedReservations
      ? JSON.parse(storedReservations)
      : [];

    console.log("All reservations:", allReservations);
    console.log("Current user:", user);
    console.log("Stadium name:", user.stadiumName);

    // Filter reservations for this owner's stadium only
    // Don't show reservations that were deleted by users
    const ownerReservations = allReservations.filter(
      (r) => r.stadiumName === user.stadiumName && !r.deleted_by_user
    );

    console.log("Owner reservations:", ownerReservations);

    // Calculate stats - only count non-deleted reservations
    const pendingCount = ownerReservations.filter(
      (r) => r.status === "waiting"
    ).length;
    const acceptedCount = ownerReservations.filter(
      (r) => r.status === "accepted"
    ).length;
    const rejectedCount = ownerReservations.filter(
      (r) => r.status === "rejected"
    ).length;
    const paidCount = ownerReservations.filter(
      (r) => r.status === "paid"
    ).length;

    setStats({
      pending: pendingCount,
      accepted: acceptedCount,
      rejected: rejectedCount,
      paid: paidCount,
    });

    setReservations(ownerReservations);
    setLoading(false);

    // Set up interval to check periodically (every minute)
    const interval = setInterval(() => {
      const updated = checkAndUpdateExpiredReservations();
      if (updated) {
        // Refresh the data if any reservations were updated
        const refreshedReservations = JSON.parse(
          localStorage.getItem("reservations") || "[]"
        );
        const refreshedOwnerReservations = refreshedReservations.filter(
          (r) => r.stadiumName === user.stadiumName && !r.deleted_by_user
        );

        setReservations(refreshedOwnerReservations);

        // Update stats
        const newPendingCount = refreshedOwnerReservations.filter(
          (r) => r.status === "waiting"
        ).length;
        const newAcceptedCount = refreshedOwnerReservations.filter(
          (r) => r.status === "accepted"
        ).length;
        const newRejectedCount = refreshedOwnerReservations.filter(
          (r) => r.status === "rejected"
        ).length;
        const newPaidCount = refreshedOwnerReservations.filter(
          (r) => r.status === "paid"
        ).length;

        setStats({
          pending: newPendingCount,
          accepted: newAcceptedCount,
          rejected: newRejectedCount,
          paid: newPaidCount,
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleAcceptReservation = (reservationId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedReservations = localStorage.getItem("reservations");
    const allReservations = JSON.parse(storedReservations);

    const updatedReservations = allReservations.map((reservation) => {
      if (reservation.id === reservationId) {
        return {
          ...reservation,
          status: "accepted",
          acceptedAt: new Date().getTime(), // Add timestamp when reservation is accepted
        };
      }
      return reservation;
    });

    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    // Update local state
    setReservations((prevReservations) =>
      prevReservations.map((reservation) => {
        if (reservation.id === reservationId) {
          return {
            ...reservation,
            status: "accepted",
            acceptedAt: new Date().getTime(), // Add timestamp when reservation is accepted
          };
        }
        return reservation;
      })
    );

    // Update stats
    setStats({
      ...stats,
      pending: stats.pending - 1,
      accepted: stats.accepted + 1,
    });
  };

  const handleRejectReservation = (reservationId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedReservations = localStorage.getItem("reservations");
    const allReservations = JSON.parse(storedReservations);

    const updatedReservations = allReservations.map((reservation) => {
      if (reservation.id === reservationId) {
        return { ...reservation, status: "rejected" };
      }
      return reservation;
    });

    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    // Update local state
    setReservations((prevReservations) =>
      prevReservations.map((reservation) => {
        if (reservation.id === reservationId) {
          return { ...reservation, status: "rejected" };
        }
        return reservation;
      })
    );

    // Update stats
    setStats({
      ...stats,
      pending: stats.pending - 1,
      rejected: stats.rejected + 1,
    });
  };

  const formatTimeSlots = (timeSlots) => {
    return timeSlots
      .map((slotId) => {
        const [start, end] = slotId.split("-");
        return `${start}:00-${end}:00`;
      })
      .join(", ");
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (activeTab === "pending") return reservation.status === "waiting";
    if (activeTab === "accepted") return reservation.status === "accepted";
    if (activeTab === "rejected") return reservation.status === "rejected";
    if (activeTab === "paid") return reservation.status === "paid";
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
    hover: {
      transition: {
        duration: 0.3,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: {
      backgroundColor: "rgba(26, 26, 26)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const countVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 },
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

      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-center text-[#fffce1] flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mr-3 text-[#4de840]"
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
        {user.stadiumName} Dashboard
      </motion.h1>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
      >
        <motion.div
          variants={cardVariants}
          custom={0}
          whileHover="hover"
          className={`bg-[#171717]/60 hover:bg-[rgb(25,25,25)] backdrop-blur-[10px] border-2 ${
            activeTab === "pending" ? "border-[#ffb700]" : "border-white/15"
          } rounded-[20px] shadow-lg p-6 cursor-pointer transition-all duration-300`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ffb700]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#ffb700]"
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
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stats.pending}
                initial="initial"
                animate="animate"
                variants={countVariants}
                className="text-3xl font-bold text-[#fffce1]"
              >
                {stats.pending}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[#ffb700] font-medium">Pending Reservations</div>
          <div className="mt-2 text-[#fffce1]/50 text-sm">
            Awaiting your approval
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          custom={1}
          whileHover="hover"
          className={`bg-[#171717]/60 hover:bg-[rgb(25,25,25)] backdrop-blur-[10px] border-2 ${
            activeTab === "accepted" ? "border-[#4de840]" : "border-white/15"
          } rounded-[20px] shadow-lg p-6 cursor-pointer transition-all duration-300`}
          onClick={() => setActiveTab("accepted")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#4de840]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#4de840]"
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
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stats.accepted}
                initial="initial"
                animate="animate"
                variants={countVariants}
                className="text-3xl font-bold text-[#fffce1]"
              >
                {stats.accepted}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[#4de840] font-medium">
            Accepted Reservations
          </div>
          <div className="mt-2 text-[#fffce1]/50 text-sm">
            Waiting for payment
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          custom={2}
          whileHover="hover"
          className={`bg-[#171717]/60 hover:bg-[rgb(25,25,25)] backdrop-blur-[10px] border-2 ${
            activeTab === "rejected" ? "border-[#ff4d4d]" : "border-white/15"
          } rounded-[20px] shadow-lg p-6 cursor-pointer transition-all duration-300`}
          onClick={() => setActiveTab("rejected")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ff4d4d]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#ff4d4d]"
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
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stats.rejected}
                initial="initial"
                animate="animate"
                variants={countVariants}
                className="text-3xl font-bold text-[#fffce1]"
              >
                {stats.rejected}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[#ff4d4d] font-medium">
            Rejected Reservations
          </div>
          <div className="mt-2 text-[#fffce1]/50 text-sm">Declined by you</div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          custom={3}
          whileHover="hover"
          className={`bg-[#171717]/60 hover:bg-[rgb(25,25,25)] backdrop-blur-[10px] border-2 ${
            activeTab === "paid" ? "border-[#4dabff]" : "border-white/15"
          } rounded-[20px] shadow-lg p-6 cursor-pointer transition-all duration-300`}
          onClick={() => setActiveTab("paid")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#4dabff]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#4dabff]"
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
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stats.paid}
                initial="initial"
                animate="animate"
                variants={countVariants}
                className="text-3xl font-bold text-[#fffce1]"
              >
                {stats.paid}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[#4dabff] font-medium">Paid Reservations</div>
          <div className="mt-2 text-[#fffce1]/50 text-sm">
            Completed bookings
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 bg-[#0e100f]/70 backdrop-blur-[10px] border border-white/15 rounded-[20px] shadow-lg"
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
              className="mt-6 text-[#fffce1]/70 text-lg"
            >
              Loading reservations...
            </motion.p>
          </motion.div>
        ) : filteredReservations.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              {activeTab === "pending" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#ffb700]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : activeTab === "accepted" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#4de840]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : activeTab === "rejected" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#ff4d4d]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#4dabff]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold mb-3 text-[#fffce1]"
            >
              No {activeTab} reservations
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-[#fffce1]/70 max-w-md mx-auto"
            >
              {activeTab === "pending"
                ? "You don't have any pending reservations at the moment."
                : activeTab === "accepted"
                ? "You don't have any accepted reservations waiting for payment."
                : activeTab === "rejected"
                ? "You don't have any rejected reservations."
                : "You don't have any paid reservations yet."}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[rgb(18,18,18)] backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-[#171717]/60">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#fffce1]/50 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#fffce1]/50 uppercase tracking-wider"
                    >
                      Stadium
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#fffce1]/50 uppercase tracking-wider"
                    >
                      Date and Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#fffce1]/50 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-[#fffce1]/50 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-[#fffce1]/50 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <AnimatePresence>
                    {filteredReservations.map((reservation, index) => (
                      <motion.tr
                        key={reservation.id}
                        custom={index}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover="hover"
                        className="transition-colors duration-200"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4de840]/20 to-[#2ca322]/20 flex items-center justify-center text-[#4de840] mr-3">
                              {reservation.username
                                ? reservation.username.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#fffce1]">
                                {reservation.username}
                              </div>
                              <div className="text-sm text-[#fffce1]/50">
                                {reservation.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-[#fffce1]">
                            {reservation.stadiumName}
                          </div>
                          <div className="text-sm text-[#fffce1]/50">
                            {reservation.city}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-[#fffce1]">
                            {reservation.date}
                          </div>
                          <div className="text-sm text-[#fffce1]/50">
                            {formatTimeSlots(reservation.timeSlots)}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-[#4de840] font-medium">
                            {reservation.totalPrice} AZN
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full ${
                              reservation.status === "waiting"
                                ? "bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/20"
                                : reservation.status === "accepted"
                                ? "bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20"
                                : reservation.status === "rejected"
                                ? "bg-[#ff4d4d]/10 text-[#ff4d4d] border border-[#ff4d4d]/20"
                                : "bg-[#4dabff]/10 text-[#4dabff] border border-[#4dabff]/20"
                            }`}
                          >
                            {reservation.status === "waiting" ? (
                              <>
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Pending
                              </>
                            ) : reservation.status === "accepted" ? (
                              <>
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Accepted
                              </>
                            ) : reservation.status === "rejected" ? (
                              <>
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
                                Rejected
                              </>
                            ) : (
                              <>
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Paid
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          {reservation.status === "waiting" && (
                            <div className="flex justify-end space-x-3">
                              <motion.button
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                                onClick={() =>
                                  handleAcceptReservation(reservation.id)
                                }
                                className="px-3 py-1.5 bg-[#4de840]/10 text-[#4de840] border border-[#4de840]/20 rounded-full hover:bg-[#4de840]/20 transition-all duration-300 flex items-center"
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
                                Accept
                              </motion.button>
                              <motion.button
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                                onClick={() =>
                                  handleRejectReservation(reservation.id)
                                }
                                className="px-3 py-1.5 bg-[#ff4d4d]/10 text-[#ff4d4d] border border-[#ff4d4d]/20 rounded-full hover:bg-[#ff4d4d]/20 transition-all duration-300 flex items-center"
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
                                Reject
                              </motion.button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
