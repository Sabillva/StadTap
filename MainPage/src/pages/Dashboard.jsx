"use client";

import { useState, useEffect, useContext } from "react";
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
    const ownerReservations = allReservations.filter(
      (r) => r.stadiumName === user.stadiumName
    );

    console.log("Owner reservations:", ownerReservations);

    // Calculate stats
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
          (r) => r.stadiumName === user.stadiumName
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        {user.stadiumName} Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          className={`bg-[#2a2a2a] border-2 ${
            activeTab === "pending" ? "border-yellow-500" : "border-white/20"
          } rounded-xl shadow-lg p-4 cursor-pointer`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="text-2xl font-bold text-white">{stats.pending}</div>
          <div className="text-yellow-400">Pending Reservations</div>
        </div>
        <div
          className={`bg-[#2a2a2a] border-2 ${
            activeTab === "accepted" ? "border-green-500" : "border-white/20"
          } rounded-xl shadow-lg p-4 cursor-pointer`}
          onClick={() => setActiveTab("accepted")}
        >
          <div className="text-2xl font-bold text-white">{stats.accepted}</div>
          <div className="text-green-400">Accepted Reservations</div>
        </div>
        <div
          className={`bg-[#2a2a2a] border-2 ${
            activeTab === "rejected" ? "border-red-500" : "border-white/20"
          } rounded-xl shadow-lg p-4 cursor-pointer`}
          onClick={() => setActiveTab("rejected")}
        >
          <div className="text-2xl font-bold text-white">{stats.rejected}</div>
          <div className="text-red-400">Rejected Reservations</div>
        </div>
        <div
          className={`bg-[#2a2a2a] border-2 ${
            activeTab === "paid" ? "border-blue-500" : "border-white/20"
          } rounded-xl shadow-lg p-4 cursor-pointer`}
          onClick={() => setActiveTab("paid")}
        >
          <div className="text-2xl font-bold text-white">{stats.paid}</div>
          <div className="text-blue-400">Paid Reservations</div>
        </div>
      </div>

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
          <p className="mt-4 text-gray-300">Loading reservations...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
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
            No {activeTab} reservations
          </h2>
          <p className="text-gray-300 mb-6">
            There are no reservations with {activeTab} status at the moment.
          </p>
        </div>
      ) : (
        <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#333]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Stadium
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#2a2a2a] divide-y divide-gray-700">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {reservation.username}
                          </div>
                          <div className="text-sm text-gray-400">
                            {reservation.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {reservation.stadiumName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {reservation.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {reservation.date}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTimeSlots(reservation.timeSlots)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {reservation.totalPrice} AZN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      reservation.status === "waiting"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : reservation.status === "accepted"
                        ? "bg-green-500/20 text-green-400"
                        : reservation.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                      >
                        {reservation.status === "waiting"
                          ? "Pending"
                          : reservation.status === "accepted"
                          ? "Accepted"
                          : reservation.status === "rejected"
                          ? "Rejected"
                          : "Paid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {reservation.status === "waiting" && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleAcceptReservation(reservation.id)
                            }
                            className="text-green-400 hover:text-green-300"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRejectReservation(reservation.id)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
