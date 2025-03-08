"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { stadiumsData } from "../data/stadiumsData";
import {
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useReservation } from "../context/ReservationContext";

const ReservationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [stadium, setStadium] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { isStadiumAvailable, addReservation } = useReservation();
  const [fromCreateTeam, setFromCreateTeam] = useState(false);
  const [teamData, setTeamData] = useState(null);

  // Get current user from localStorage with null check
  const currentUser = (() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing currentUser from localStorage:", e);
      return null;
    }
  })();

  // Initialize component data
  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      setError("Giriş etməlisiniz");
      navigate("/login");
      return;
    }

    // Find stadium by ID
    const foundStadium = stadiumsData.find((s) => s.id === Number(id));
    if (foundStadium) {
      setStadium(foundStadium);

      // Initialize from location state if available
      if (location.state) {
        // Save team data for later use
        if (location.state.fromCreateTeam) {
          setFromCreateTeam(true);
          setTeamData({
            teamName: location.state.teamName,
            city: location.state.city,
            playDate: location.state.playDate,
            playTime: location.state.playTime,
            playerCount: location.state.playerCount,
            stadiumId: location.state.stadiumId,
            logo: location.state.logo,
            joinMatch: location.state.joinMatch,
          });
        }

        if (location.state.playDate) {
          setSelectedDate(new Date(location.state.playDate));
        }
        if (location.state.playTime) {
          setSelectedTime(location.state.playTime);
        }
        if (foundStadium.price) {
          setPrice(foundStadium.price);
        }
      }
    } else {
      setError("Stadion tapılmadı");
      navigate("/stadiums");
    }

    setLoading(false);
  }, [id, navigate, location]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setPrice(null);
    setError("");
  };

  const handleTimeChange = (time) => {
    setError("");
    if (
      isStadiumAvailable(
        stadium.id,
        selectedDate.toISOString().split("T")[0],
        time
      )
    ) {
      setSelectedTime(time);
      if (stadium) {
        setPrice(stadium.price);
      }
    } else {
      setError(
        "Bu saat artıq rezervasiya olunub. Zəhmət olmasa başqa saat seçin."
      );
    }
  };

  const handleReservation = () => {
    // Clear previous errors
    setError("");

    // Check if user is logged in
    if (!currentUser) {
      setError("Giriş etməlisiniz");
      navigate("/login");
      return;
    }

    // Check if all required fields are selected
    if (!selectedDate || !selectedTime || !price) {
      setError("Zəhmət olmasa tarix və saat seçin");
      return;
    }

    try {
      const reservation = {
        id: Date.now(),
        stadiumId: stadium.id,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        price: price,
        userId: currentUser.id,
        paid: false,
        expiresAt: new Date(
          selectedDate.getTime() + 24 * 60 * 60 * 1000
        ).toISOString(), // 24 hours from now
      };

      addReservation(reservation);

      // If coming from team creation, pass all team data back
      if (fromCreateTeam && teamData) {
        navigate("/payment-process", {
          state: {
            reservation,
            teamData: {
              ...teamData,
              playDate: selectedDate.toISOString().split("T")[0],
              playTime: selectedTime,
              stadiumId: stadium.id,
            },
          },
        });
      } else {
        navigate("/payment-process", {
          state: {
            reservation,
          },
        });
      }
    } catch (err) {
      console.error("Error creating reservation:", err);
      setError("Rezervasiya yaradılarkən xəta baş verdi. Yenidən cəhd edin.");
    }
  };

  const handleReturnToCreateTeam = () => {
    if (fromCreateTeam && teamData) {
      navigate("/create-team", {
        state: {
          ...teamData,
          playDate: selectedDate
            ? selectedDate.toISOString().split("T")[0]
            : teamData.playDate,
          playTime: selectedTime || teamData.playTime,
          stadiumId: stadium ? stadium.id : teamData.stadiumId,
        },
      });
    } else {
      navigate("/create-team");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Yüklənir...</p>
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Stadion tapılmadı
        </div>
        <button
          onClick={() => navigate("/stadiums")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Stadionlara Qayıt
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rezervasiya Prosesi</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={stadium.image || "/placeholder.svg"}
            alt={stadium.name}
            className="w-full h-auto rounded-lg shadow-md mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{stadium.name}</h2>
          <div className="flex items-center mb-2">
            <MapPin className="mr-2" size={18} />
            <span>{stadium.city}</span>
          </div>
          <div className="flex items-center mb-2">
            <DollarSign className="mr-2" size={18} />
            <span>{stadium.price} AZN/saat</span>
          </div>

          {fromCreateTeam && (
            <button
              onClick={handleReturnToCreateTeam}
              className="mt-4 flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
            >
              <ArrowLeft className="mr-2" size={16} />
              Team yaratmağa geri dön
            </button>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Tarix və Saat Seçin</h3>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            inline
          />
          {selectedDate && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Mövcud Saatlar</h4>
              <div className="grid grid-cols-3 gap-2">
                {stadium.availableHours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleTimeChange(hour)}
                    className={`p-2 rounded ${
                      selectedTime === hour
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          )}
          {price && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2">
                Rezervasiya Detalları
              </h4>
              <div className="flex items-center mb-2">
                <Clock className="mr-2" size={18} />
                <span>
                  {selectedDate.toLocaleDateString()} - {selectedTime}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <DollarSign className="mr-2" size={18} />
                <span className="text-xl font-bold">{price} AZN</span>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleReservation}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Rezervasiya Et
                </button>
                <button
                  onClick={() => navigate("/stadiums")}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                >
                  Ləğv Et
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationProcess;
