"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
import { getStadiumById } from "../utils/stadiumUtils";

const ReservationTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const searchParams = new URLSearchParams(location.search);
  const dateFromUrl = searchParams.get("date");

  const [selectedDate, setSelectedDate] = useState(
    dateFromUrl || new Date().toISOString().split("T")[0]
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Find the stadium with the matching ID
  const stadium = getStadiumById(id);

  useEffect(() => {
    // Function to check and update expired reservations
    const checkExpiredReservations = () => {
      const allReservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const today = new Date().toISOString().split("T")[0];
      const currentHour = new Date().getHours();

      let hasUpdates = false;

      const updatedReservations = allReservations.map((reservation) => {
        // Only check waiting reservations
        if (reservation.status === "waiting") {
          // Check if the date is today or in the past
          if (
            reservation.date < today ||
            (reservation.date === today &&
              reservation.timeSlots.some((slot) => {
                const slotHour = Number.parseInt(slot.split("-")[0], 10);
                return slotHour <= currentHour;
              }))
          ) {
            hasUpdates = true;
            return {
              ...reservation,
              status: "rejected",
              autoRejected: true,
              rejectedAt: new Date().getTime(),
              rejectionReason: "Automatically rejected: Time slot has passed",
            };
          }
        }

        // Check if payment time expired for accepted reservations
        if (reservation.status === "accepted" && reservation.acceptedAt) {
          // Calculate the expiry time based on the minimum of:
          // 1. Standard 1 hour payment window
          // 2. Time until the reservation starts (if it's a future reservation)
          let expiryTime = reservation.acceptedAt + 60 * 60 * 1000; // Default: 1 hour in milliseconds

          // Check if this is a reservation for today
          if (reservation.date === today) {
            // Find the earliest time slot
            const earliestSlotHour = Math.min(
              ...reservation.timeSlots.map((slot) =>
                Number.parseInt(slot.split("-")[0], 10)
              )
            );

            // Calculate when this slot starts today
            const slotStartTime = new Date();
            slotStartTime.setHours(earliestSlotHour, 0, 0, 0);

            // If the slot starts in the future but sooner than our 1-hour window
            if (
              slotStartTime.getTime() > new Date().getTime() &&
              slotStartTime.getTime() < expiryTime
            ) {
              // Set expiry time to when the slot starts
              expiryTime = slotStartTime.getTime();
            }
          }

          if (new Date().getTime() > expiryTime) {
            hasUpdates = true;
            return {
              ...reservation,
              status: "rejected",
              autoRejected: true,
              rejectedAt: new Date().getTime(),
              rejectionReason: "Automatically rejected: Payment time expired",
            };
          }
        }

        return reservation;
      });

      if (hasUpdates) {
        localStorage.setItem(
          "reservations",
          JSON.stringify(updatedReservations)
        );
      }

      return hasUpdates;
    };

    // Run once when component mounts
    checkExpiredReservations();

    // Set up interval to check periodically (every minute)
    const interval = setInterval(checkExpiredReservations, 60000);

    return () => clearInterval(interval);
  }, []);

  // If stadium not found, redirect to reserve page
  useEffect(() => {
    if (!stadium) {
      navigate("/reserve");
    } else {
      // Simulate loading for a smoother experience
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stadium, navigate]);

  // Generate time slots from 10:00 to 23:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour < 23; hour++) {
      slots.push({
        id: `${hour}-${hour + 1}`,
        start: `${hour}:00`,
        end: `${hour + 1}:00`,
        reserved: false,
      });
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  // Load existing reservations for this stadium and date
  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage

    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    const stadiumReservations = allReservations.filter(
      (r) =>
        r.stadiumId === id &&
        r.date === selectedDate &&
        (r.status === "accepted" ||
          r.status === "waiting" ||
          r.status === "paid")
    );

    setReservations(stadiumReservations);

    // Mark reserved time slots
    const updatedTimeSlots = generateTimeSlots().map((slot) => {
      const isReserved = stadiumReservations.some((r) =>
        r.timeSlots.includes(slot.id)
      );
      return {
        ...slot,
        reserved: isReserved,
      };
    });

    setTimeSlots(updatedTimeSlots);

    // Clear selected time slots when date changes
    setSelectedTimeSlots([]);
    setTotalPrice(0);
  }, [id, selectedDate]);

  // Calculate total price when selected time slots change
  useEffect(() => {
    // Get the latest stadium data to ensure we have the current hourly rate
    const currentStadium = getStadiumById(id);
    const hourlyRate = currentStadium ? currentStadium.hourlyRate : 0;

    setTotalPrice(selectedTimeSlots.length * hourlyRate);
  }, [selectedTimeSlots, id]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSlotClick = (slotId) => {
    // Check if the slot is already reserved
    const slot = timeSlots.find((s) => s.id === slotId);
    if (slot.reserved) {
      return;
    }

    // Toggle selection
    if (selectedTimeSlots.includes(slotId)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((id) => id !== slotId));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slotId]);
    }
  };

  const handleRemindMeLater = (slotId, e) => {
    e.stopPropagation();
    // In a real app, this would set up a notification
    alert(`You will be notified if the time slot ${slotId} becomes available.`);
  };

  const handleReserve = () => {
    if (selectedTimeSlots.length === 0) {
      alert("Please select at least one time slot");
      return;
    }

    // Find the stadium owner
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const stadiumOwner = users.find(
      (u) => u.userType === "owner" && u.stadiumName === stadium.name
    );

    // Create a new reservation
    const newReservation = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      email: user.email,
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      stadiumImage: stadium.image,
      city: stadium.city,
      date: selectedDate,
      timeSlots: selectedTimeSlots,
      totalPrice,
      status: "waiting", // waiting, accepted, rejected, paid
      createdAt: new Date().toISOString(),
      stadiumOwnerId: stadiumOwner ? stadiumOwner.id : null,
    };

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage

    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    allReservations.push(newReservation);
    localStorage.setItem("reservations", JSON.stringify(allReservations));

    // Redirect to my reservations page
    navigate("/my-reservations");
  };

  // Check if the current time is past the slot time for today
  const isTimeSlotPast = (slotId) => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate !== today) {
      return false;
    }

    const currentHour = new Date().getHours();
    const slotHour = Number.parseInt(slotId.split("-")[0], 10);

    return currentHour >= slotHour;
  };

  // Set the next day
  const handleSetTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  };

  // Set today
  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
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
    exit: { opacity: 0 },
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

  const timeSlotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: custom * 0.03,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    }),
    selected: {
      scale: [1, 1.05, 1],
      boxShadow: "0 0 15px rgba(77, 232, 64, 0.5)",
      transition: {
        duration: 0.3,
      },
    },
    unselected: {
      scale: 1,
      boxShadow: "none",
      transition: {
        duration: 0.3,
      },
    },
  };

  if (!stadium) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
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
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
        >
          <div className="relative h-48 md:h-64 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={
                stadium.image ||
                `https://source.unsplash.com/random/1600x900/?football,stadium&sig=${stadium.id}`
              }
              alt={stadium.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Math.random()}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-[#171717]/60 to-transparent"></div>

            {/* Stadium info overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 p-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#fffce1] mb-2">
                Reserve {stadium.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
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
                  <span className="text-[#fffce1]">{stadium.city}</span>
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-[#fffce1] font-semibold">
                    {stadium.hourlyRate} AZN/hour
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="p-6 md:p-8">
            <motion.div variants={itemVariants} className="mb-8">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-[#fffce1] mb-2"
              >
                Select Date
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-white/15 bg-[rgb(25,25,25)]/80 text-[#fffce1] rounded-3xl shadow-sm focus:outline-none focus:border-[#4de840] focus:ring-1 focus:ring-[#4de840] transition-all duration-300 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#4de840]"
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
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleSetToday}
                    className="px-4 py-3 bg-[rgb(25,25,25)]/80 text-[#fffce1] rounded-3xl border-2 border-white/15 hover:border-[#4de840] transition-all duration-300 cursor-pointer"
                  >
                    Today
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleSetTomorrow}
                    className="px-4 py-3 bg-[rgb(25,25,25)]/80 text-[#fffce1] rounded-3xl border-2 border-white/15 hover:border-[#4de840] transition-all duration-300 cursor-pointer"
                  >
                    Tomorrow
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-[#fffce1] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#4de840]"
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
                Available Time Slots
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <AnimatePresence>
                  {timeSlots.map((slot, index) => {
                    const isPast = isTimeSlotPast(slot.id);
                    const isSelected = selectedTimeSlots.includes(slot.id);
                    const isPaid = reservations.some(
                      (r) =>
                        r.status === "paid" && r.timeSlots.includes(slot.id)
                    );

                    let bgColor = "bg-[#0e100f]/80";
                    let borderColor = "border-white/15";
                    let textColor = "text-[#fffce1]";
                    let statusColor = "text-[#fffce1]/50";
                    let statusText = "Available";

                    if (isPast) {
                      bgColor = "bg-[#0e100f]/50";
                      borderColor = "border-white/10";
                      textColor = "text-[#fffce1]/40";
                      statusColor = "text-[#fffce1]/30";
                      statusText = "Past";
                    } else if (isPaid) {
                      bgColor = "bg-blue-500/10";
                      borderColor = "border-blue-500/30";
                      statusColor = "text-blue-400";
                      statusText = "Paid";
                    } else if (slot.reserved) {
                      bgColor = "bg-red-500/10";
                      borderColor = "border-red-500/30";
                      statusColor = "text-red-400";
                      statusText = "Reserved";
                    } else if (isSelected) {
                      bgColor = "bg-[#4de840]/10";
                      borderColor = "border-[#4de840]";
                      statusColor = "text-[#4de840]";
                      statusText = "Selected";
                    }

                    return (
                      <motion.div
                        key={slot.id}
                        custom={index}
                        variants={timeSlotVariants}
                        initial="hidden"
                        animate={isSelected ? "selected" : "visible"}
                        whileHover={
                          !isPast && !slot.reserved && !isPaid
                            ? { scale: 1.05 }
                            : {}
                        }
                        whileTap={
                          !isPast && !slot.reserved && !isPaid
                            ? { scale: 0.95 }
                            : {}
                        }
                        onClick={() =>
                          !isPast &&
                          !slot.reserved &&
                          !isPaid &&
                          handleTimeSlotClick(slot.id)
                        }
                        className={`${bgColor} border-2 ${borderColor} rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                          isPast || slot.reserved || isPaid
                            ? "opacity-70 cursor-not-allowed"
                            : isSelected
                            ? "shadow-lg shadow-[#4de840]/20"
                            : "hover:border-[#4de840]/50 hover:bg-[#4de840]/5"
                        }`}
                      >
                        <div className={`font-medium ${textColor}`}>
                          {slot.start} - {slot.end}
                        </div>
                        <div className={`text-xs mt-1 ${statusColor}`}>
                          {statusText}
                        </div>

                        {slot.reserved && !isPast && !isPaid && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleRemindMeLater(slot.id, e)}
                            className="mt-2 text-xs px-3 py-1 bg-[#0e100f]/80 border border-blue-500/30 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 cursor-pointer"
                          >
                            Remind Me
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>

            <AnimatePresence>
              {selectedTimeSlots.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 p-6 bg-[rgb(25,25,25)] border-2 border-white/15 rounded-[20px] shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-4 text-[#fffce1] flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-[#4de840]"
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
                    Your Selection
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTimeSlots.map((slotId, index) => {
                      const slot = timeSlots.find((s) => s.id === slotId);
                      return (
                        <motion.div
                          key={slotId}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-[#4de840]/10 border border-[#4de840]/30 rounded-full px-4 py-2 text-sm text-[#4de840] flex items-center"
                        >
                          <span>
                            {slot.start} - {slot.end}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTimeSlotClick(slotId)}
                            className="ml-2 w-5 h-5 rounded-full bg-[#4de840]/20 flex items-center justify-center hover:bg-[#4de840]/30 transition-colors cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-[#4de840]"
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
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#fffce1]/70">
                      {selectedTimeSlots.length}{" "}
                      {selectedTimeSlots.length === 1 ? "hour" : "hours"}{" "}
                      selected
                    </div>
                    <div className="text-xl font-bold text-[#fffce1]">
                      Total:{" "}
                      <span className="text-[#4de840]">{totalPrice} AZN</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-[rgb(25,25,25)] border-2 border-white/15 text-[#fffce1] rounded-full hover:border-[#4de840]/50 transition-all duration-300 flex items-center cursor-pointer"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </motion.button>

              <motion.button
                whileHover={selectedTimeSlots.length > 0 ? { scale: 1.05 } : {}}
                whileTap={selectedTimeSlots.length > 0 ? { scale: 0.95 } : {}}
                onClick={handleReserve}
                disabled={selectedTimeSlots.length === 0}
                className={`px-8 py-3 rounded-full flex items-center relative overflow-hidden cursor-pointer ${
                  selectedTimeSlots.length === 0
                    ? "bg-[#0e100f]/50 text-[#fffce1]/30 border-2 border-white/10 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 group"
                }`}
              >
                <span className="relative z-10">Reserve Now</span>
                {selectedTimeSlots.length > 0 && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 relative z-10"
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
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReservationTime;
