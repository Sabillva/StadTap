"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const EditMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    stadiumName: "",
    city: "",
    homeTeamId: "",
    awayTeamName: "",
    contactPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    // Get user's teams
    const storedTeams = localStorage.getItem("teams");
    const teams = storedTeams ? JSON.parse(storedTeams) : [];
    const myTeams = teams.filter((team) =>
      team.members.some(
        (member) => member.id === user.id && member.status === "accepted"
      )
    );
    setUserTeams(myTeams);

    // Get match data
    const storedMatches = localStorage.getItem("matches");
    const matches = storedMatches ? JSON.parse(storedMatches) : [];
    const match = matches.find((m) => m.id === id);

    if (!match) {
      navigate("/matches");
      return;
    }

    // Check if user is the creator
    if (match.creatorId !== user.id) {
      navigate(`/matches/${id}`);
      return;
    }

    // Format date and time
    const matchDate = new Date(match.date);
    const dateString = matchDate.toISOString().split("T")[0];
    const timeString = matchDate.toTimeString().slice(0, 5);

    setFormData({
      title: match.title || "Friendly Match",
      date: dateString,
      time: timeString,
      stadiumName: match.stadiumName || "",
      city: match.city || "",
      homeTeamId: match.homeTeamId || "",
      awayTeamName: match.awayTeamName || "",
      contactPhone: match.contactPhone || "",
      notes: match.notes || "",
    });

    setLoading(false);
  }, [id, navigate, user.id]);

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

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (!formData.homeTeamId) {
      newErrors.homeTeamId = "Home team is required";
    }

    if (!formData.awayTeamName.trim()) {
      newErrors.awayTeamName = "Away team name is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Combine date and time
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    // Update match
    setTimeout(() => {
      const storedMatches = localStorage.getItem("matches");
      const matches = JSON.parse(storedMatches);
      const updatedMatches = matches.map((match) => {
        if (match.id === id) {
          return {
            ...match,
            title: formData.title,
            date: dateTime.toISOString(),
            stadiumName: formData.stadiumName,
            city: formData.city,
            homeTeamId: formData.homeTeamId,
            homeTeamName: userTeams.find(
              (team) => team.id === formData.homeTeamId
            )?.name,
            awayTeamName: formData.awayTeamName,
            contactPhone: formData.contactPhone,
            notes: formData.notes,
          };
        }
        return match;
      });

      localStorage.setItem("matches", JSON.stringify(updatedMatches));

      setIsSubmitting(false);
      navigate(`/matches/${id}`);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
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
        <p className="mt-4 text-gray-300">Loading match details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Match</h1>

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
                  Date <span className="text-red-400">*</span>
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
                  required
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
                  Time <span className="text-red-400">*</span>
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
                  required
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-400">{errors.time}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="homeTeamId"
                className="block text-sm font-medium text-white mb-1"
              >
                Your Team (Home Team) <span className="text-red-400">*</span>
              </label>
              <select
                id="homeTeamId"
                name="homeTeamId"
                value={formData.homeTeamId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.homeTeamId ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
              >
                <option value="">Select your team</option>
                {userTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.homeTeamId && (
                <p className="mt-1 text-sm text-red-400">{errors.homeTeamId}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="awayTeamName"
                className="block text-sm font-medium text-white mb-1"
              >
                Opponent Team Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="awayTeamName"
                name="awayTeamName"
                value={formData.awayTeamName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.awayTeamName ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Enter opponent team name"
                required
              />
              {errors.awayTeamName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.awayTeamName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-white mb-1"
                >
                  City <span className="text-red-400">*</span>
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
                  required
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
                placeholder="+994 XX XXX XX XX"
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
                onClick={() => navigate(`/matches/${id}`)}
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
                    Updating...
                  </>
                ) : (
                  "Update Match"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatch;
