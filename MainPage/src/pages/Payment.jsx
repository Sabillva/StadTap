"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Payment = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call to verify the payment link
    // For demo purposes, we'll use localStorage

    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    const foundReservation = allReservations.find(
      (r) => r.id === reservationId
    );

    if (!foundReservation || foundReservation.status !== "accepted") {
      setExpired(true);
      setLoading(false);
      return;
    }

    setReservation(foundReservation);
    setLoading(false);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setExpired(true);

          // Update reservation status to payment_rejected
          const updatedReservations = allReservations.map((r) => {
            if (r.id === reservationId) {
              return { ...r, status: "payment_rejected" };
            }
            return r;
          });

          localStorage.setItem(
            "reservations",
            JSON.stringify(updatedReservations)
          );

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reservationId]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);

      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "expiryDate") {
      // Format expiry date as MM/YY
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);

      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "cvv") {
      // Only allow numbers and max 3 digits
      const formattedValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.cardNumber.trim() ||
      formData.cardNumber.replace(/\s/g, "").length !== 16
    ) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Please enter the card holder name";
    }

    if (!formData.expiryDate.trim() || !formData.expiryDate.includes("/")) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = formData.expiryDate.split("/");
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

    if (!formData.cvv.trim() || formData.cvv.length !== 3) {
      newErrors.cvv = "Please enter a valid 3-digit CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Update reservation status to paid
      const allReservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const updatedReservations = allReservations.map((r) => {
        if (r.id === reservationId) {
          return { ...r, status: "paid" };
        }
        return r;
      });

      localStorage.setItem("reservations", JSON.stringify(updatedReservations));

      // Redirect to my reservations page
      navigate("/my-reservations");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222]">
        <div className="text-center">
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

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222] px-4">
        <div className="max-w-md w-full bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
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
          <h2 className="text-2xl font-bold mb-4 text-white">
            Payment Link Expired
          </h2>
          <p className="text-gray-300 mb-6">
            This payment link has expired or is no longer valid. Payment links
            are only valid for 1 hour after reservation acceptance.
          </p>
          <button
            onClick={() => navigate("/my-reservations")}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Go to My Reservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222] px-4 py-12">
      <div className="max-w-lg w-full bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-500 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Payment</h1>
            <div className="text-sm">
              Time remaining:{" "}
              <span className="font-mono">{formatTimeLeft()}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Reservation Details
            </h2>
            <div className="bg-[#333] rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Stadium:</div>
                  <div className="font-medium text-gray-300">
                    {reservation.stadiumName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Date:</div>
                  <div className="font-medium text-gray-300">
                    {reservation.date}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Time Slots:</div>
                  <div className="font-medium text-gray-300">
                    {reservation.timeSlots
                      .map((slotId) => {
                        const [start, end] = slotId.split("-");
                        return `${start}:00-${end}:00`;
                      })
                      .join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Amount:</div>
                  <div className="font-medium text-lg text-green-400">
                    {reservation.totalPrice} AZN
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4 text-white">
              Payment Information
            </h2>

            <div className="mb-4">
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
                value={formData.cardNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.cardNumber ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.cardNumber}</p>
              )}
            </div>

            <div className="mb-4">
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
                value={formData.cardHolder}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.cardHolder ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
              />
              {errors.cardHolder && (
                <p className="mt-1 text-sm text-red-400">{errors.cardHolder}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
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
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.expiryDate ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
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
                  value={formData.cvv}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.cvv ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-400">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/my-reservations")}
                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {processing ? (
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
                ) : (
                  `Pay ${reservation.totalPrice} AZN`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
