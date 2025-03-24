"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
import { calculatePaymentTimeRemaining } from "../utils/reservationUtils";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Calculate remaining time in seconds (1 hour from acceptance)
  const calculateRemainingTime = calculatePaymentTimeRemaining;

  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  useEffect(() => {
    console.log("Payment component mounted with id:", id);

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    console.log("All reservations:", allReservations);

    const foundReservation = allReservations.find((r) => r.id === id);
    console.log("Found reservation:", foundReservation);

    if (!foundReservation || foundReservation.userId !== user.id) {
      // Reservation not found or doesn't belong to this user
      console.log(
        "Reservation not found or doesn't belong to user, redirecting..."
      );
      navigate("/my-reservations");
      return;
    }

    // Check if the reservation is in the correct status
    if (foundReservation.status !== "accepted") {
      console.log("Reservation status is not 'accepted', redirecting...");
      navigate("/my-reservations");
      return;
    }

    setReservation(foundReservation);
    setLoading(false);

    // Initialize countdown
    const initialCountdown = calculateRemainingTime(foundReservation);
    console.log("Initial countdown:", initialCountdown);
    setCountdown(initialCountdown);

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(timer);
          // When countdown reaches zero, update the reservation status to rejected
          const allReservations = JSON.parse(
            localStorage.getItem("reservations") || "[]"
          );
          const updatedReservations = allReservations.map((r) => {
            if (r.id === id && r.status === "accepted") {
              return {
                ...r,
                status: "rejected",
                autoRejected: true,
                rejectedAt: new Date().getTime(),
                rejectionReason: "Automatically rejected: Payment time expired",
              };
            }
            return r;
          });
          localStorage.setItem(
            "reservations",
            JSON.stringify(updatedReservations)
          );

          // Redirect to my reservations page
          navigate("/my-reservations");
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [id, user.id, navigate]);

  // Redirect if countdown reaches zero
  useEffect(() => {
    if (countdown === 0 && reservation) {
      alert(
        "Payment time has expired. You will be redirected to your reservations."
      );
      navigate("/my-reservations");
    }
  }, [countdown, reservation, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle card number formatting
    if (name === "cardNumber") {
      // Only allow numbers
      const numbersOnly = value.replace(/\D/g, "").slice(0, 16);

      // Format with spaces every 4 digits
      const formattedValue = numbersOnly.replace(/(\d{4})(?=\d)/g, "$1 ");

      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      });
    }
    // Handle expiry date formatting
    else if (name === "expiryDate") {
      // Only allow numbers
      const numbersOnly = value.replace(/\D/g, "").slice(0, 4);

      // Format as MM/YY
      let formattedValue = numbersOnly;
      if (numbersOnly.length > 2) {
        formattedValue = numbersOnly.slice(0, 2) + "/" + numbersOnly.slice(2);
      }

      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      });
    }
    // Handle CVV (numbers only, max 3 digits)
    else if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3);

      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      });

      // Auto-flip card when focusing on CVV
      if (!cardFlipped) {
        setCardFlipped(true);
      }
    }
    // Handle other fields
    else {
      setCardDetails({
        ...cardDetails,
        [name]: value,
      });

      // Flip back to front when focusing on other fields
      if (cardFlipped && name !== "cvv") {
        setCardFlipped(false);
      }
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      // Check card number - must be exactly 16 digits
      const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, "");
      if (
        !cardNumberDigits ||
        cardNumberDigits.length !== 16 ||
        !/^\d+$/.test(cardNumberDigits)
      ) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }

      if (!cardDetails.cardHolder.trim()) {
        newErrors.cardHolder = "Please enter the card holder name";
      }
      // Check expiry date
      if (
        !cardDetails.expiryDate.trim() ||
        !cardDetails.expiryDate.includes("/")
      ) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      } else {
        const [month, year] = cardDetails.expiryDate.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        // Check if month is valid (1-12)
        if (
          !/^\d{2}$/.test(month) ||
          Number.parseInt(month, 10) < 1 ||
          Number.parseInt(month, 10) > 12
        ) {
          newErrors.expiryDate = "Please enter a valid month (01-12)";
        }
        // Check if year is valid (current year or later)
        else if (
          !/^\d{2}$/.test(year) ||
          Number.parseInt(year, 10) < currentYear
        ) {
          newErrors.expiryDate = "Card has expired";
        }
        // Check if card is expired (current year and month is past)
        else if (
          Number.parseInt(year, 10) === currentYear &&
          Number.parseInt(month, 10) < currentMonth
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }

      if (
        !cardDetails.cvv.trim() ||
        cardDetails.cvv.length !== 3 ||
        !/^\d+$/.test(cardDetails.cvv)
      ) {
        newErrors.cvv = "Please enter a valid 3-digit CVV";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (countdown <= 0) {
      alert(
        "Payment time has expired. You will be redirected to your reservations."
      );
      navigate("/my-reservations");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      // Show success animation
      setPaymentSuccess(true);

      // In a real app, this would be an API call to process payment
      // For demo purposes, we'll update the reservation status in localStorage
      setTimeout(() => {
        const allReservations = JSON.parse(
          localStorage.getItem("reservations") || "[]"
        );
        const updatedReservations = allReservations.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              status: "paid",
              paidAt: new Date().toISOString(),
            };
          }
          return r;
        });

        localStorage.setItem(
          "reservations",
          JSON.stringify(updatedReservations)
        );

        setIsSubmitting(false);

        // Redirect after showing success animation
        setTimeout(() => {
          navigate("/my-reservations");
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const formatTimeSlots = (timeSlots) => {
    return timeSlots
      .map((slotId) => {
        const [start, end] = slotId.split("-");
        return `${start}:00-${end}:00`;
      })
      .join(", ");
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      // y: -5,
      boxShadow: "0 1px 2px -5px rgba(77, 232, 64, 0.1)",
      // borderColor: "rgba(77, 232, 64, 0.3)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const creditCardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.5 },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.5 },
    },
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
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
            Loading payment details...
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

      {/* Success overlay */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="bg-[#171717]/80 backdrop-blur-md border-2 border-[#4de840]/30 rounded-3xl p-8 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.3, duration: 0.5 },
                }}
                className="w-20 h-20 bg-[#4de840]/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#4de840]"
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
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 0.5 },
                }}
                className="text-2xl font-bold text-[#fffce1] mb-2"
              >
                Payment Successful!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.6, duration: 0.5 },
                }}
                className="text-[#fffce1]/70 mb-6"
              >
                Your reservation has been confirmed. Thank you for your payment.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.8, duration: 0.5 },
                }}
              >
                <span className="text-sm text-[#4de840]">
                  Redirecting to your reservations...
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold mb-6 text-center text-[#fffce1]"
        >
          Complete Your Payment
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-center text-[#fffce1]/70 mb-10 max-w-2xl mx-auto"
        >
          Your reservation is confirmed for{" "}
          {formatTimeSlots(reservation.timeSlots)} on {reservation.date}. Please
          complete the payment to secure your booking.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="lg:col-span-1 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-[#fffce1] flex items-center">
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
                Order Summary
              </h2>
            </div>

            <div className="p-6">
              {/* Stadium info */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-[#4de840]/10 flex items-center justify-center text-[#4de840] mr-3 flex-shrink-0">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#fffce1]">
                      {reservation.stadiumName}
                    </h3>
                    <p className="text-[#fffce1]/70 text-sm">
                      {reservation.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and time */}
              <div className="mb-6">
                <div className="text-sm text-[#fffce1]/50 mb-2">
                  Date & Time:
                </div>
                <div className="flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[#fffce1]">{reservation.date}</span>
                </div>
                <div className="flex items-center mt-2">
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
                  <span className="text-[#fffce1]">
                    {formatTimeSlots(reservation.timeSlots)}
                  </span>
                </div>
              </div>

              {/* Reservation ID */}
              <div className="mb-6">
                <div className="text-sm text-[#fffce1]/50 mb-2">
                  Reservation ID:
                </div>
                <div className="flex items-center">
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
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <span className="text-[#fffce1] text-sm font-mono">
                    {reservation.id}
                  </span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#fffce1]/70">Subtotal:</span>
                  <span className="text-[#fffce1]">
                    {reservation.totalPrice} AZN
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#fffce1]/70">Tax:</span>
                  <span className="text-[#fffce1]">0.00 AZN</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-white/10">
                  <span className="font-semibold text-[#fffce1]">Total:</span>
                  <span className="font-semibold text-[#4de840]">
                    {reservation.totalPrice} AZN
                  </span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-sm text-amber-400 mb-2 flex items-center justify-center">
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
                    Time remaining to complete payment:
                  </div>
                  <div className="text-2xl font-mono font-bold text-amber-400">
                    {formatTime(countdown)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="lg:col-span-2 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-[#fffce1] flex items-center">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Payment Method
              </h2>
            </div>

            <div className="p-6">
              {/* Payment method selection */}
              <div className="mb-8">
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 p-4 border-2 ${
                      paymentMethod === "card"
                        ? "border-[#4de840]/50 bg-[#4de840]/5"
                        : "border-white/10"
                    } rounded-xl cursor-pointer transition-all duration-300`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === "card"
                            ? "border-[#4de840]"
                            : "border-white/30"
                        } flex items-center justify-center mr-3`}
                      >
                        {paymentMethod === "card" && (
                          <div className="w-3 h-3 bg-[#4de840] rounded-full"></div>
                        )}
                      </div>
                      <div className="text-[#fffce1] font-medium">
                        Credit/Debit Card
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-2 pl-8">
                      <div className="w-8 h-6 bg-blue-600 rounded"></div>
                      <div className="w-8 h-6 bg-red-500 rounded"></div>
                      <div className="w-8 h-6 bg-yellow-500 rounded"></div>
                      <div className="w-8 h-6 bg-gray-700 rounded border border-white/20"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit card preview */}
              <div className="mb-8 perspective">
                <motion.div
                  className="relative w-full h-56 md:h-64"
                  initial={false}
                  animate={cardFlipped ? "back" : "front"}
                  variants={creditCardVariants}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-white/10 shadow-lg"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-8 bg-gradient-to-br from-[#4de840]/80 to-[#2ca322]/80 rounded-md flex items-center justify-center">
                          <div className="w-8 h-4 border-2 border-black/30 rounded-sm"></div>
                        </div>
                        <div className="text-[#fffce1] font-medium">
                          Credit Card
                        </div>
                      </div>

                      <div className="my-4">
                        <div className="text-sm text-[#fffce1]/50 mb-1">
                          Card Number
                        </div>
                        <div className="text-xl text-[#fffce1] font-mono tracking-wider">
                          {cardDetails.cardNumber || "•••• •••• •••• ••••"}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-[#fffce1]/50 mb-1">
                            Card Holder
                          </div>
                          <div className="text-sm text-[#fffce1] font-medium uppercase">
                            {cardDetails.cardHolder || "YOUR NAME"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#fffce1]/50 mb-1">
                            Expires
                          </div>
                          <div className="text-sm text-[#fffce1]">
                            {cardDetails.expiryDate || "MM/YY"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-white/10 shadow-lg"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="w-full h-12 bg-black/50 mt-6"></div>
                      <div className="px-6 mt-6">
                        <div className="flex items-center justify-end">
                          <div className="bg-white/10 h-10 w-3/4 flex items-center px-4 justify-end">
                            <div className="text-sm text-[#fffce1] font-mono tracking-wider">
                              {cardDetails.cvv || "•••"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 text-xs text-[#fffce1]/50 text-right">
                          CVV
                        </div>
                      </div>
                      <div className="mt-auto mb-6 px-6">
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-8 bg-gradient-to-br from-[#4de840]/80 to-[#2ca322]/80 rounded-md flex items-center justify-center">
                            <div className="w-8 h-4 border-2 border-black/30 rounded-sm"></div>
                          </div>
                          <div className="text-[#fffce1] font-medium">
                            Credit Card
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                    >
                      Card Number
                    </label>
                    <div className="relative">
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                          errors.cardNumber
                            ? "border-rose-500/50"
                            : "border-white/10 focus:border-[#4de840]/50"
                        } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                        disabled={countdown <= 0}
                      />
                      {errors.cardNumber && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    {errors.cardNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-rose-400"
                      >
                        {errors.cardNumber}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cardHolder"
                      className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                    >
                      Card Holder Name
                    </label>
                    <div className="relative">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={cardDetails.cardHolder}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                          errors.cardHolder
                            ? "border-rose-500/50"
                            : "border-white/10 focus:border-[#4de840]/50"
                        } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                        disabled={countdown <= 0}
                      />
                      {errors.cardHolder && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    {errors.cardHolder && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-rose-400"
                      >
                        {errors.cardHolder}
                      </motion.p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        Expiry Date
                      </label>
                      <div className="relative">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.expiryDate
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                          disabled={countdown <= 0}
                        />
                        {errors.expiryDate && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.expiryDate && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.expiryDate}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        CVV
                      </label>
                      <div className="relative">
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
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          onFocus={() => setCardFlipped(true)}
                          onBlur={() => setCardFlipped(false)}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.cvv
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                          disabled={countdown <= 0}
                        />
                        {errors.cvv && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.cvv && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.cvv}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <motion.button
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      type="button"
                      onClick={() => navigate("/my-reservations")}
                      className="px-5 py-2.5 bg-[rgb(25,25,25)] border-2 border-white/10 text-[#fffce1] rounded-full hover:border-white/30 transition-all duration-300 flex items-center hover:bg-[rgb(26,26,26)] cursor-pointer"
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
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Reservations
                    </motion.button>

                    <motion.button
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      type="submit"
                      disabled={isSubmitting || countdown <= 0}
                      className={`px-6 py-2.5 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center cursor-pointer ${
                        isSubmitting || countdown <= 0
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-[#0e100f] border-t-transparent rounded-full mr-2"
                          ></motion.div>
                          Processing...
                        </>
                      ) : countdown <= 0 ? (
                        "Time Expired"
                      ) : (
                        <>
                          Pay {reservation.totalPrice} AZN
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
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
