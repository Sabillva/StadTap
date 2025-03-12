"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Payment = () => {
  // Change from id to match the route parameter
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

  // Calculate remaining time in seconds (1 hour from acceptance)
  const calculateRemainingTime = (reservation) => {
    if (!reservation || !reservation.acceptedAt) return 0;

    const expiryTime = reservation.acceptedAt + 60 * 60 * 1000; // 1 hour in milliseconds
    const remainingMs = expiryTime - new Date().getTime();
    return Math.max(0, Math.floor(remainingMs / 1000)); // Convert to seconds, minimum 0
  };

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
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);

      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      });
    }
    // Handle expiry date formatting
    else if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);

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
    }
    // Handle other fields
    else {
      setCardDetails({
        ...cardDetails,
        [name]: value,
      });
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
      if (
        !cardDetails.cardNumber.trim() ||
        cardDetails.cardNumber.replace(/\s/g, "").length !== 16
      ) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }

      if (!cardDetails.cardHolder.trim()) {
        newErrors.cardHolder = "Please enter the card holder name";
      }

      if (
        !cardDetails.expiryDate.trim() ||
        !cardDetails.expiryDate.includes("/")
      ) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      } else {
        const [month, year] = cardDetails.expiryDate.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (
          Number.parseInt(month, 10) < 1 ||
          Number.parseInt(month, 10) > 12 ||
          Number.parseInt(year, 10) < currentYear ||
          (Number.parseInt(year, 10) === currentYear &&
            Number.parseInt(month, 10) < currentMonth)
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }

      if (!cardDetails.cvv.trim() || cardDetails.cvv.length !== 3) {
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
      // In a real app, this would be an API call to process payment
      // For demo purposes, we'll update the reservation status in localStorage

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

      localStorage.setItem("reservations", JSON.stringify(updatedReservations));

      setIsSubmitting(false);

      // Show success message and redirect
      alert("Payment successful! Your reservation is confirmed.");
      navigate("/my-reservations");
    }, 2000);
  };

  const formatTimeSlots = (timeSlots) => {
    return timeSlots
      .map((slotId) => {
        const [start, end] = slotId.split("-");
        return `${start}:00-${end}:00`;
      })
      .join(", ");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg">
          <svg
            className="animate-spin h-10 w-10 text-green-400 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-300">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Payment
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Order Summary
              </h2>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Stadium:</div>
                <div className="font-medium text-gray-300">
                  {reservation.stadiumName}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Date:</div>
                <div className="font-medium text-gray-300">
                  {reservation.date}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Time Slots:</div>
                <div className="font-medium text-gray-300">
                  {formatTimeSlots(reservation.timeSlots)}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">
                  Reservation ID:
                </div>
                <div className="font-medium text-xs text-gray-300">
                  {reservation.id}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="font-medium text-gray-300">
                    {reservation.totalPrice} AZN
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Tax:</span>
                  <span className="font-medium text-gray-300">0.00 AZN</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-4">
                  <span className="font-semibold text-white">Total:</span>
                  <span className="font-semibold text-green-400">
                    {reservation.totalPrice} AZN
                  </span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-sm text-orange-400 mb-2 flex items-center justify-center">
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
                  <div className="text-xl font-mono font-bold text-orange-400">
                    {formatTime(countdown)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Payment Method
              </h2>

              <div className="mb-6">
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 p-4 border-2 ${
                      paymentMethod === "card"
                        ? "border-green-500"
                        : "border-gray-600"
                    } rounded-lg cursor-pointer`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === "card"
                            ? "border-green-500"
                            : "border-gray-600"
                        } flex items-center justify-center mr-3`}
                      >
                        {paymentMethod === "card" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-white">Credit/Debit Card</div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-600"
                        } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        disabled={countdown <= 0}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cardHolder"
                        className="block text-sm font-medium text-white mb-1"
                      >
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={cardDetails.cardHolder}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.cardHolder
                            ? "border-red-500"
                            : "border-gray-600"
                        } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        disabled={countdown <= 0}
                      />
                      {errors.cardHolder && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.cardHolder}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-white mb-1"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            errors.expiryDate
                              ? "border-red-500"
                              : "border-gray-600"
                          } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          disabled={countdown <= 0}
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-white mb-1"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            errors.cvv ? "border-red-500" : "border-gray-600"
                          } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          disabled={countdown <= 0}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate("/my-reservations")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || countdown <= 0}
                    className={`px-6 py-2 rounded-full ${
                      isSubmitting || countdown <= 0
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    } transition-colors`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : countdown <= 0 ? (
                      "Time Expired"
                    ) : (
                      `Pay ${reservation.totalPrice} AZN`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
