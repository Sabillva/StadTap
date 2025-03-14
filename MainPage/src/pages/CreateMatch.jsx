"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { validatePhoneNumber } from "../utils/validationUtils";

const CreateMatch = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "Friendly Match",
    date: "",
    time: "",
    stadiumName: "",
    city: "",
    contactPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!validatePhoneNumber(formData.contactPhone)) {
      newErrors.contactPhone =
        "Please enter a valid phone number format (only + at beginning and numbers allowed)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Combine date and time if both are provided
    let dateTime = null;
    if (formData.date && formData.time) {
      dateTime = new Date(`${formData.date}T${formData.time}`);
    }

    // Create new match
    const newMatch = {
      id: Date.now().toString(),
      title: formData.title,
      date: dateTime ? dateTime.toISOString() : undefined,
      stadiumName: formData.stadiumName || undefined,
      city: formData.city || undefined,
      contactPhone: formData.contactPhone,
      notes: formData.notes,
      creatorId: user.id,
      creatorName: `${user.firstName} ${user.lastName}`,
      createdAt: new Date().toISOString(),
      // Add opponent functionality
      hasOpponent: false,
      opponentId: null,
      opponentName: null,
      joinRequests: [], // For opponent requests
    };

    // Save to localStorage
    setTimeout(() => {
      const storedMatches = localStorage.getItem("matches");
      const matches = storedMatches ? JSON.parse(storedMatches) : [];

      matches.push(newMatch);
      localStorage.setItem("matches", JSON.stringify(matches));

      setIsSubmitting(false);
      navigate(`/matches/${newMatch.id}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          Create a New Match
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white mb-1"
              >
                Match Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 border ${
                    errors.date ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-400">{errors.date}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.time ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-400">{errors.time}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-white mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.city ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="stadiumName"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Stadium Name
                </label>
                <input
                  type="text"
                  id="stadiumName"
                  name="stadiumName"
                  value={formData.stadiumName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter stadium name (optional)"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contactPhone"
                className="block text-sm font-medium text-white mb-1"
              >
                Contact Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.contactPhone ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="+994XXXXXXXXX"
                required
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.contactPhone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-white mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Any additional information about the match"
              ></textarea>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate("/matches")}
                className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
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
                    Creating...
                  </>
                ) : (
                  "Create Match"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch;
