"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DollarSign, Calendar, ArrowLeft } from "lucide-react";
import { useReservation } from "../context/ReservationContext";
import { useTeams } from "../context/TeamsContext";
import { useMatches } from "../context/MatchesContext";

const PaymentProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    reservation,
    teamData,
    teamId,
    matchId,
    isTeamPayment,
    isMatchPayment,
  } = location.state || {};
  const { updateReservation } = useReservation();
  const { teams } = useTeams();
  const { matches } = useMatches();

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [team, setTeam] = useState(null);
  const [match, setMatch] = useState(null);
  const [paymentSource, setPaymentSource] = useState("");

  useEffect(() => {
    if (!reservation) {
      navigate("/stadiums");
      return;
    }

    // Determine payment source and load related data
    if (isTeamPayment && teamId) {
      setPaymentSource("team");
      const foundTeam = teams.find((t) => t.id === teamId);
      setTeam(foundTeam);
    } else if (isMatchPayment && matchId) {
      setPaymentSource("match");
      const foundMatch = matches.find((m) => m.id === matchId);
      setMatch(foundMatch);
    } else if (teamData) {
      setPaymentSource("teamCreation");
    }
  }, [
    reservation,
    navigate,
    teamId,
    matchId,
    isTeamPayment,
    isMatchPayment,
    teams,
    matches,
    teamData,
  ]);

  const validateForm = () => {
    if (cardNumber.length < 16) {
      setError("Kart nömrəsi ən azı 16 rəqəm olmalıdır");
      return false;
    }

    if (!cardName.trim()) {
      setError("Kart sahibinin adını daxil edin");
      return false;
    }

    if (expiryDate.length < 5) {
      setError("Etibarlılıq müddəti düzgün deyil");
      return false;
    }

    if (cvv.length < 3) {
      setError("CVV kodu ən azı 3 rəqəm olmalıdır");
      return false;
    }

    return true;
  };

  // Format expiration date and time for display
  const formatExpirationDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      // Update reservation as paid
      const updatedReservation = { ...reservation, paid: true };
      updateReservation(updatedReservation);

      // Navigate to confirmation page with appropriate data
      navigate("/payment-confirmation", {
        state: {
          ...updatedReservation,
          paymentMethod,
          teamData: teamData || null,
          teamId: team?.id || null,
          matchId: match?.id || null,
          isTeamPayment,
          isMatchPayment,
        },
      });
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Ödəniş zamanı xəta baş verdi. Yenidən cəhd edin.");
    }
  };

  const handleBack = () => {
    if (paymentSource === "team" && team) {
      navigate(`/team/${team.id}`);
    } else if (paymentSource === "match" && match) {
      navigate(`/matches/${match.id}`);
    } else if (paymentSource === "teamCreation" && teamData) {
      navigate("/create-team", {
        state: {
          ...teamData,
          isReserved: true,
        },
      });
    } else {
      navigate("/stadiums");
    }
  };

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Rezervasiya məlumatları tapılmadı
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
      <h1 className="text-3xl font-bold mb-6">Ödəniş Prosesi</h1>

      {error && (
        <div className="max-w-md mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Rezervasiya Məlumatları
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="mr-2" size={18} />
              <span>
                {new Date(reservation.date).toLocaleDateString()} -{" "}
                {reservation.time}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <DollarSign className="mr-2" size={18} />
              <span className="text-xl font-bold">{reservation.price} AZN</span>
            </div>

            {reservation && !reservation.paid && (
              <div className="mb-2">
                <span className="text-gray-600">Son Ödəniş Tarixi:</span>{" "}
                {formatExpirationDateTime(reservation.expiresAt)}
              </div>
            )}

            {/* Display context-specific information */}
            {team && (
              <div className="mb-4 pt-2 border-t border-gray-200">
                <p className="font-medium">Komanda: {team.name}</p>
              </div>
            )}

            {match && (
              <div className="mb-4 pt-2 border-t border-gray-200">
                <p className="font-medium">
                  Matç: {match.team1.name} vs{" "}
                  {match.team2 ? match.team2.name : "Gözlənilir"}
                </p>
              </div>
            )}

            <button
              onClick={handleBack}
              className="mt-4 flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
            >
              <ArrowLeft className="mr-2" size={16} />
              {paymentSource === "teamCreation"
                ? "Team yaratmağa geri dön"
                : "Geri Qayıt"}
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Ödəniş Məlumatları</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Ödəniş Metodu
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="credit_card">Kredit Kartı</option>
                <option value="debit_card">Debet Kartı</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Kart Nömrəsi
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Kart Sahibinin Adı
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="AD SOYAD"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bitmə Tarixi
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  placeholder="123"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Ödənişi Tamamla
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcess;
