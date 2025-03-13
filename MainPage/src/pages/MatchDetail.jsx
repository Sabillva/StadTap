"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = storedMatches ? JSON.parse(storedMatches) : [];
    const foundMatch = matches.find((m) => m.id === id);

    if (!foundMatch) {
      navigate("/matches");
      return;
    }

    setMatch(foundMatch);
    setIsCreator(foundMatch.creatorId === user.id);
    setLoading(false);
  }, [id, navigate, user.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isMatchPast = (dateString) => {
    if (!dateString) return false;

    const matchDate = new Date(dateString);
    const now = new Date();
    return matchDate < now;
  };

  const handleDeleteMatch = () => {
    if (!confirm("Are you sure you want to delete this match?")) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const matches = JSON.parse(storedMatches);
    const updatedMatches = matches.filter((m) => m.id !== id);

    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    navigate("/matches");
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
      <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {match.title || "Football Match"}
              </h1>
              <p className="text-gray-400 mt-1">
                Created by: {match.creatorName || "Unknown"}
              </p>
            </div>
            <div className="flex space-x-2">
              {match.date && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isMatchPast(match.date)
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {isMatchPast(match.date) ? "Completed" : "Upcoming"}
                </span>
              )}
              {isCreator && (!match.date || !isMatchPast(match.date)) && (
                <>
                  <Link
                    to={`/matches/edit/${match.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDeleteMatch}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Date & Time:</div>
              <div className="font-medium text-white">
                {formatDate(match.date)}
              </div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Stadium:</div>
              <div className="font-medium text-white">
                {match.stadiumName || "Not specified"}
              </div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">City:</div>
              <div className="font-medium text-white">
                {match.city || "Not specified"}
              </div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Contact:</div>
              <div className="font-medium text-white">
                {match.contactPhone || "Not provided"}
              </div>
            </div>
          </div>

          {match.notes && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-white">Notes</h2>
              <div className="bg-[#333] p-4 rounded-lg">
                <p className="text-gray-300">{match.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate("/matches")}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
