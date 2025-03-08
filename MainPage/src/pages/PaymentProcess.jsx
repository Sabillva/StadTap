"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DollarSign, Calendar, ArrowLeft } from "lucide-react";
import { useReservation } from "../context/ReservationContext";

const PaymentProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation, teamData } = location.state || {};
  const { updateReservation } = useReservation();

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reservation) {
      navigate("/stadiums");
    }
  }, [reservation, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (cardNumber.length < 16) {
      setError("Kart nömrəsi ən azı 16 rəqəm olmalıdır");
      return;
    }

    if (!cardName.trim()) {
      setError("Kart sahibinin adını daxil edin");
      return;
    }

    if (expiryDate.length < 5) {
      setError("Etibarlılıq müddəti düzgün deyil");
      return;
    }

    if (cvv.length < 3) {
      setError("CVV kodu ən azı 3 rəqəm olmalıdır");
      return;
    }

    // Here you would typically process the payment
    // For now, we'll just simulate a successful payment
    const updatedReservation = { ...reservation, paid: true };
    updateReservation(updatedReservation);

    // If coming from team creation, navigate to payment confirmation with teamData
    navigate("/payment-confirmation", {
      state: {
        ...updatedReservation,
        paymentMethod,
        teamData: teamData, // Pass teamData to payment confirmation
      },
    });
  };

  const handleBackToCreateTeam = () => {
    // Make sure we're passing all the team data back to CreateTeam
    if (teamData) {
      navigate("/create-team", {
        state: {
          ...teamData,
          isReserved: true,
          reservationId: reservation.id,
        },
      });
    } else {
      navigate("/create-team");
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

            {teamData && (
              <button
                onClick={handleBackToCreateTeam}
                className="mt-4 flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
              >
                <ArrowLeft className="mr-2" size={16} />
                Team yaratmağa geri dön
              </button>
            )}
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
