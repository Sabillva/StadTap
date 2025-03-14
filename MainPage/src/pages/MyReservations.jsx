"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
// Import the utility function at the top
import {
  checkAndUpdateExpiredReservations,
  calculatePaymentTimeRemaining,
} from "../utils/reservationUtils";

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});

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

  // Use the imported function instead:
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
    // Check for expired reservations first
    const hasUpdates = checkAndUpdateExpiredReservations();

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );

    let userReservations = allReservations.filter((r) => r.userId === user.id);

    // Process each reservation to ensure acceptedAt is set for accepted reservations
    userReservations = userReservations.map(updateReservationWithAcceptedTime);

    // Sort by creation date (newest first)
    userReservations.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setReservations(userReservations);
    setLoading(false);

    // Initialize countdowns for accepted reservations
    const initialCountdowns = {};
    userReservations.forEach((reservation) => {
      if (reservation.status === "accepted") {
        initialCountdowns[reservation.id] = calculateRemainingTime(reservation);
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
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-500/20 text-yellow-500";
      case "accepted":
        return "bg-green-500/20 text-green-500";
      case "rejected":
        return "bg-red-500/20 text-red-500";
      case "paid":
        return "bg-blue-500/20 text-blue-500";
      case "payment_waiting":
        return "bg-yellow-500/20 text-yellow-500";
      case "payment_rejected":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        My Reservations
      </h1>

      {loading ? (
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
          <p className="mt-4 text-gray-300">Loading your reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-2 text-white">
            No reservations found
          </h2>
          <p className="text-gray-300 mb-6">
            You haven't made any reservations yet.
          </p>
          <Link
            to="/reserve"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Make a Reservation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative overflow-hidden">
                  <img
                    src={
                      reservation.stadiumImage ||
                      `https://source.unsplash.com/random/300x200/?football,stadium&sig=${
                        reservation.id || "/placeholder.svg"
                      }`
                    }
                    alt={reservation.stadiumName}
                    className="h-48 w-full object-cover md:w-48 md:h-full transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.src = `https://source.unsplash.com/random/300x200/?football,stadium&sig=${Math.random()}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-2">
                    <span className="bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {reservation.hourlyRate ||
                        reservation.totalPrice /
                          reservation.timeSlots.length}{" "}
                      AZN/hour
                    </span>
                  </div>
                </div>
                <div className="p-6 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-white">
                        {reservation.stadiumName}
                      </h2>
                      <div className="flex items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-400 mr-1"
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
                        <span className="text-gray-300">
                          {reservation.city}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {reservation.status === "waiting" && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            "waiting"
                          )}`}
                        >
                          Reserve Waiting
                        </span>
                      )}
                      {reservation.status === "accepted" && (
                        <>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              "accepted"
                            )}`}
                          >
                            Reserve Accepted
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              "payment_waiting"
                            )}`}
                          >
                            Payment Waiting
                          </span>
                        </>
                      )}
                      {reservation.status === "rejected" && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            "rejected"
                          )}`}
                        >
                          Reserve Rejected
                        </span>
                      )}
                      {reservation.status === "paid" && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            "paid"
                          )}`}
                        >
                          Payment Successful
                        </span>
                      )}
                      {reservation.status === "payment_rejected" && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            "payment_rejected"
                          )}`}
                        >
                          Payment Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Date:</div>
                      <div className="font-medium text-gray-300">
                        {reservation.date}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        Time Slots:
                      </div>
                      <div className="font-medium text-gray-300">
                        {formatTimeSlots(reservation.timeSlots)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        Total Price:
                      </div>
                      <div className="font-medium text-gray-300">
                        {reservation.totalPrice} AZN
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        Reservation ID:
                      </div>
                      <div className="font-medium text-xs text-gray-300">
                        {reservation.id}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    {reservation.status === "accepted" && (
                      <div className="flex flex-col items-end w-full">
                        <div className="flex justify-between w-full">
                          <div className="text-sm text-yellow-400">
                            Please check your email to verify payment
                          </div>
                          <Link
                            to={`/payment/${reservation.id}`}
                            className={`px-4 py-2 ${
                              countdowns[reservation.id] > 0
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            } rounded-full transition-colors`}
                            onClick={(e) => {
                              console.log(
                                "Payment button clicked for reservation:",
                                reservation.id
                              );
                              console.log(
                                "Current countdown:",
                                countdowns[reservation.id]
                              );
                              if (countdowns[reservation.id] <= 0) {
                                console.log(
                                  "Preventing navigation - timer expired"
                                );
                                e.preventDefault();
                              }
                            }}
                          >
                            Go to Payment (Demo)
                          </Link>
                        </div>
                        {countdowns[reservation.id] !== undefined && (
                          <div className="text-xs text-orange-400 mt-2 flex items-center">
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
                            Payment button active for:{" "}
                            {formatTime(countdowns[reservation.id])}
                          </div>
                        )}
                      </div>
                    )}

                    {(reservation.status === "waiting" ||
                      reservation.status === "rejected" ||
                      reservation.status === "payment_rejected") && (
                      <button
                        onClick={() => handleDeleteReservation(reservation.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                    {reservation.status === "paid" && (
                      <div className="text-sm text-green-400">
                        Your reservation is confirmed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
