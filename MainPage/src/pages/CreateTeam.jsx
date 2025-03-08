"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { stadiumsData } from "../data/stadiumsData";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { addTeam, teams, isUserTeamCreator, isUserInAnyTeam } = useTeams();
  const [teamName, setTeamName] = useState("");
  const [city, setCity] = useState("");
  const [playDate, setPlayDate] = useState("");
  const [playTime, setPlayTime] = useState("");
  const [playerCount, setPlayerCount] = useState(5);
  const [stadiumId, setStadiumId] = useState("");
  const [availableStadiums, setAvailableStadiums] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [logo, setLogo] = useState(null);
  const [joinMatch, setJoinMatch] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyInTeam, setIsAlreadyInTeam] = useState(false);
  const location = useLocation();

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

  // Redirect to login if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Check if user is already in a team
  useEffect(() => {
    if (currentUser && isUserInAnyTeam && isUserInAnyTeam(currentUser.id)) {
      setIsAlreadyInTeam(true);
      setError(
        "Siz artıq bir komandanın üzvüsünüz. Yeni komanda yarada bilməzsiniz."
      );
    }
  }, [currentUser, isUserInAnyTeam]);

  // Check if user is already a team creator
  useEffect(() => {
    if (currentUser && isUserTeamCreator && isUserTeamCreator(currentUser.id)) {
      setError(
        "Siz artıq bir komandanın yaradıcısısınız. Yeni komanda yarada bilməzsiniz."
      );
    }
  }, [currentUser, isUserTeamCreator]);

  // Load data from location state if available
  useEffect(() => {
    if (location.state) {
      const {
        teamName: stateTeamName,
        city: stateCity,
        playDate: statePlayDate,
        playTime: statePlayTime,
        playerCount: statePlayerCount,
        stadiumId: stateStadiumId,
        logo: stateLogo,
        joinMatch: stateJoinMatch,
        isReserved: stateIsReserved,
        reservationId: stateReservationId,
      } = location.state;

      if (stateTeamName) setTeamName(stateTeamName);
      if (stateCity) setCity(stateCity);
      if (statePlayDate) setPlayDate(statePlayDate);
      if (statePlayTime) setPlayTime(statePlayTime);
      if (statePlayerCount) setPlayerCount(statePlayerCount);
      if (stateStadiumId) setStadiumId(stateStadiumId.toString());
      if (stateLogo) setLogo(stateLogo);
      if (stateJoinMatch !== undefined) setJoinMatch(stateJoinMatch);
      if (stateIsReserved) setIsReserved(true);

      // Log the loaded state for debugging
      console.log("Loaded state from navigation:", location.state);
    }
  }, [location.state]);

  // Filter stadiums based on selected city
  useEffect(() => {
    if (city) {
      const filteredStadiums = stadiumsData.filter(
        (stadium) => stadium.city === city
      );
      setAvailableStadiums(filteredStadiums);
    } else {
      setAvailableStadiums([]);
    }
    if (!location.state?.stadiumId) {
      setStadiumId("");
    }
  }, [city, location.state]);

  // Get available times for selected stadium and date
  useEffect(() => {
    if (stadiumId && playDate) {
      const stadium = stadiumsData.find((s) => s.id === Number(stadiumId));
      if (stadium) {
        setAvailableTimes(stadium.availableHours);
      }
    } else {
      setAvailableTimes([]);
    }
    if (!location.state?.playTime) {
      setPlayTime("");
    }
  }, [stadiumId, playDate, location.state]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!currentUser) {
      setError("Giriş etməlisiniz");
      navigate("/login");
      return false;
    }

    if (isAlreadyInTeam) {
      setError(
        "Siz artıq bir komandanın üzvüsünüz. Yeni komanda yarada bilməzsiniz."
      );
      return false;
    }

    if (isUserTeamCreator && isUserTeamCreator(currentUser.id)) {
      setError(
        "Siz artıq bir komandanın yaradıcısısınız. Yeni komanda yarada bilməzsiniz."
      );
      return false;
    }

    if (!teamName.trim()) {
      setError("Komanda adını daxil edin");
      return false;
    }
    if (!city) {
      setError("Şəhər seçin");
      return false;
    }
    if (!stadiumId) {
      setError("Stadion seçin");
      return false;
    }
    if (!playDate) {
      setError("Oyun tarixini seçin");
      return false;
    }
    if (!playTime) {
      setError("Oyun saatını seçin");
      return false;
    }
    return true;
  };

  const handleReservation = () => {
    // Validate form before proceeding
    if (!validateForm()) return;

    // Save all form data to pass to the reservation page
    navigate(`/reservation/${stadiumId}`, {
      state: {
        teamName,
        city,
        playDate,
        playTime,
        playerCount,
        stadiumId,
        logo,
        joinMatch,
        fromCreateTeam: true,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Check if user is logged in
      if (!currentUser) {
        setError("Giriş etməlisiniz");
        setIsSubmitting(false);
        navigate("/login");
        return;
      }

      // Check if user is already a team creator
      if (isUserTeamCreator && isUserTeamCreator(currentUser.id)) {
        setError(
          "Siz artıq bir komandanın yaradıcısısınız. Yeni komanda yarada bilməzsiniz."
        );
        setIsSubmitting(false);
        return;
      }

      // Check if user is already in a team
      if (isUserInAnyTeam && isUserInAnyTeam(currentUser.id)) {
        setError(
          "Siz artıq bir komandanın üzvüsünüz. Yeni komanda yarada bilməzsiniz."
        );
        setIsSubmitting(false);
        return;
      }

      if (!isReserved) {
        setError("Zəhmət olmasa əvvəlcə rezervasiya edin.");
        setIsSubmitting(false);
        return;
      }

      const selectedStadium = stadiumsData.find(
        (stadium) => stadium.id === Number(stadiumId)
      );

      const newTeam = {
        id: Date.now(),
        name: teamName,
        city,
        playDate,
        playTime,
        playerCount,
        currentPlayers: 1,
        stadium: selectedStadium ? selectedStadium.name : "",
        stadiumId: Number(stadiumId),
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          profileImage: currentUser.profileImage,
        },
        members: [
          {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage,
            isCreator: true,
          },
        ],
        chatMembers: [
          {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage,
          },
        ],
        joinMatch,
        isReady: false,
        logo: logo,
      };

      const success = addTeam(newTeam);

      if (success) {
        console.log("Team created successfully:", newTeam);
        navigate("/teams");
      } else {
        setError("Komanda yaradılarkən xəta baş verdi. Yenidən cəhd edin.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      setError("Komanda yaradılarkən xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form should be disabled
  const isFormDisabled =
    !currentUser ||
    isAlreadyInTeam ||
    (isUserTeamCreator && currentUser && isUserTeamCreator(currentUser.id));

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Giriş etməlisiniz
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Giriş Səhifəsinə Get
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Komanda Yarat</h1>

      {error && (
        <div className="max-w-md mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label htmlFor="teamName" className="block text-sm font-medium mb-1">
            Komanda Adı
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Şəhər
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isFormDisabled}
          >
            <option value="">Şəhər seçin</option>
            <option value="Bakı">Bakı</option>
            <option value="Sumqayıt">Sumqayıt</option>
            <option value="Gəncə">Gəncə</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="stadium" className="block text-sm font-medium mb-1">
            Stadion
          </label>
          <select
            id="stadium"
            value={stadiumId}
            onChange={(e) => setStadiumId(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!city || isFormDisabled}
          >
            <option value="">Stadion seçin</option>
            {availableStadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="playDate" className="block text-sm font-medium mb-1">
            Oyun Tarixi
          </label>
          <input
            type="date"
            id="playDate"
            value={playDate}
            onChange={(e) => setPlayDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min={new Date().toISOString().split("T")[0]}
            disabled={isFormDisabled}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playTime" className="block text-sm font-medium mb-1">
            Oyun Saatı
          </label>
          <select
            id="playTime"
            value={playTime}
            onChange={(e) => setPlayTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={!stadiumId || !playDate || isFormDisabled}
          >
            <option value="">Saat seçin</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="playerCount"
            className="block text-sm font-medium mb-1"
          >
            Oyunçu Sayı
          </label>
          <input
            type="number"
            id="playerCount"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number.parseInt(e.target.value))}
            min="5"
            max="11"
            className="w-full p-2 border rounded"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="logo" className="block text-sm font-medium mb-1">
            Komanda Logosu
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full p-2 border rounded"
            disabled={isFormDisabled}
          />
          {logo && (
            <img
              src={logo || "/placeholder.svg"}
              alt="Team Logo"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Matça qoşulmaq istəyirsiniz?
          </label>
          <input
            type="checkbox"
            checked={joinMatch}
            onChange={(e) => setJoinMatch(e.target.checked)}
            disabled={isFormDisabled}
          />
        </div>
        {isReserved ? (
          <p className="text-green-500 mb-4">Rezervasiya edilmişdir</p>
        ) : (
          <button
            type="button"
            onClick={handleReservation}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mb-4 ${
              isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isFormDisabled}
          >
            Teami yaratmazdan öncə reservasiya et
          </button>
        )}
        <button
          type="submit"
          className={`w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 ${
            !isReserved || isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isReserved || isFormDisabled}
        >
          Komanda Yarat
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
