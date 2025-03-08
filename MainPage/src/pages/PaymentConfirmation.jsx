"use client";

import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, DollarSign, ArrowLeft } from "lucide-react";

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    stadiumId,
    date,
    time,
    price,
    paymentMethod,
    teamData,
    teamId,
    matchId,
    isTeamPayment,
    isMatchPayment,
  } = location.state || {};

  if (!stadiumId || !date || !time || !price) {
    return <div>Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.</div>;
  }

  const handleReturnToCreateTeam = () => {
    if (teamData) {
      navigate("/create-team", {
        state: {
          ...teamData,
          isReserved: true,
          reservationId: location.state?.id || Date.now(),
        },
      });
    }
  };

  const handleReturnToSource = () => {
    if (isTeamPayment && teamId) {
      navigate(`/team/${teamId}`);
    } else if (isMatchPayment && matchId) {
      navigate(`/matches/${matchId}`);
    } else {
      navigate("/stadiums");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto text-green-500" size={64} />
          <h1 className="text-2xl font-bold mt-4">Ödəniş Uğurla Tamamlandı!</h1>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Rezervasiya Məlumatları
          </h2>
          <div className="flex items-center mb-2">
            <Calendar className="mr-2" size={18} />
            <span>
              {new Date(date).toLocaleDateString()} - {time}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <DollarSign className="mr-2" size={18} />
            <span>{price} AZN</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Ödəniş Metodu:</span>{" "}
            {paymentMethod === "credit_card" ? "Kredit Kartı" : "Debet Kartı"}
          </div>
        </div>
        <p className="text-center text-gray-600 mb-6">
          Rezervasiya təsdiqiniz e-poçt ünvanınıza göndəriləcək.
        </p>

        <div className="space-y-3">
          {teamData ? (
            <button
              onClick={handleReturnToCreateTeam}
              className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" size={18} />
              Team yaratmağa geri dön
            </button>
          ) : isTeamPayment || isMatchPayment ? (
            <button
              onClick={handleReturnToSource}
              className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" size={18} />
              {isTeamPayment ? "Komandaya Qayıt" : "Matça Qayıt"}
            </button>
          ) : null}

          <Link
            to="/stadiums"
            className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
