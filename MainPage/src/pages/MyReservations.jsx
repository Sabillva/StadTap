"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage

    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    const userReservations = allReservations.filter(
      (r) => r.userId === user.id
    );

    // Sort by creation date (newest first)
    userReservations.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setReservations(userReservations);
    setLoading(false);
  }, [user.id]);

  const handleDeleteReservation = (reservationId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage

    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    const updatedReservations = allReservations.filter(
      (r) => r.id !== reservationId
    );

    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    // Update state
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
              className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    src={reservation.stadiumImage || "/placeholder.svg"}
                    alt={reservation.stadiumName}
                    className="h-48 w-full object-cover md:w-48"
                  />
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
                      <>
                        <div className="text-sm text-yellow-400">
                          Please check your email to verify payment
                        </div>
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-700 text-gray-400 rounded-full cursor-not-allowed"
                        >
                          Go to Payment
                        </button>
                      </>
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
