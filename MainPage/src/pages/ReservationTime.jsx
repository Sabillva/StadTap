"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import stadiumsData from "../utils/stadiumsData";

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

  // Find the stadium with the matching ID
  const stadium = stadiumsData.find((s) => s.id === id);

  // If stadium not found, redirect to reserve page
  useEffect(() => {
    if (!stadium) {
      navigate("/reserve");
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
    setTotalPrice(selectedTimeSlots.length * stadium?.hourlyRate || 0);
  }, [selectedTimeSlots, stadium]);

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

  const handleRemindMeLater = (slotId) => {
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
  if (!stadium) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Reserve {stadium.name}
          </h1>

          <div className="flex items-center mb-4">
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
            <span className="text-gray-300">{stadium.city}</span>
          </div>

          <div className="flex items-center mb-6">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-300 font-semibold">
              {stadium.hourlyRate} AZN/hour
            </span>
          </div>

          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-white mb-2"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full sm:w-64 px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-white">
              Available Time Slots
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {timeSlots.map((slot) => {
                const isPast = isTimeSlotPast(slot.id);
                const isSelected = selectedTimeSlots.includes(slot.id);

                let bgColor = "bg-[#333]";
                let borderColor = "border-gray-600";

                if (isPast) {
                  bgColor = "bg-gray-700";
                  borderColor = "border-gray-600";
                } else if (slot.reserved) {
                  bgColor = "bg-red-500/20";
                  borderColor = "border-red-500/30";
                } else if (isSelected) {
                  bgColor = "bg-green-500/20";
                  borderColor = "border-green-500";
                }

                return (
                  <div
                    key={slot.id}
                    onClick={() =>
                      !isPast && !slot.reserved && handleTimeSlotClick(slot.id)
                    }
                    className={`${bgColor} border-2 ${borderColor} rounded-md p-3 text-center cursor-pointer ${
                      isPast
                        ? "opacity-50 cursor-not-allowed"
                        : slot.reserved
                        ? ""
                        : isSelected
                        ? ""
                        : "hover:border-green-400"
                    }`}
                  >
                    <div className="font-medium text-white">
                      {slot.start} - {slot.end}
                    </div>
                    <div className="text-xs mt-1 text-gray-300">
                      {isPast
                        ? "Past"
                        : slot.reserved
                        ? "Reserved"
                        : isSelected
                        ? "Selected"
                        : "Available"}
                    </div>

                    {slot.reserved && !isPast && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemindMeLater(slot.id);
                        }}
                        className="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        Remind Me
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedTimeSlots.length > 0 && (
            <div className="mb-6 p-4 bg-[#333] border border-gray-600 rounded-md">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Your Selection
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTimeSlots.map((slotId) => {
                  const slot = timeSlots.find((s) => s.id === slotId);
                  return (
                    <div
                      key={slotId}
                      className="bg-green-500/20 border border-green-500/30 rounded-md px-3 py-1 text-sm text-green-400"
                    >
                      {slot.start} - {slot.end}
                    </div>
                  );
                })}
              </div>
              <div className="text-lg font-bold text-white">
                Total: <span className="text-green-400">{totalPrice} AZN</span>
              </div>
            </div>
          )}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleReserve}
              disabled={selectedTimeSlots.length === 0}
              className={`px-4 py-2 rounded-full ${
                selectedTimeSlots.length === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              } transition-colors`}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationTime;
