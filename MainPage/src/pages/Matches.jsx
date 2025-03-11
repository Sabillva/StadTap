"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const Matches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [userMatches, setUserMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedMatches = localStorage.getItem("matches");
    const allMatches = storedMatches ? JSON.parse(storedMatches) : [];

    // Sort matches by date (upcoming first)
    allMatches.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get user's teams
    const storedTeams = localStorage.getItem("teams");
    const teams = storedTeams ? JSON.parse(storedTeams) : [];
    const myTeams = teams.filter((team) =>
      team.members.some((member) => member.id === user.id)
    );
    setUserTeams(myTeams);

    // Filter matches where user's team is participating
    const myMatches = allMatches.filter(
      (match) =>
        match.homeTeamId &&
        myTeams.some(
          (team) => team.id === match.homeTeamId || team.id === match.awayTeamId
        )
    );

    setMatches(allMatches);
    setUserMatches(myMatches);
    setLoading(false);
  }, [user.id]);

  const getTeamName = (teamId) => {
    const team = userTeams.find((t) => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isMatchPast = (dateString) => {
    const matchDate = new Date(dateString);
    const now = new Date();
    return matchDate < now;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Matches</h1>
        <Link
          to="/matches/create"
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          Create Match
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "all"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Matches
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "my"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Team's Matches
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg">
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
          <p className="mt-4 text-gray-300">Loading matches...</p>
        </div>
      ) : activeTab === "all" && matches.length === 0 ? (
        <div className="text-center py-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
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
          <h2 className="text-2xl font-semibold mb-2 text-white">
            No matches found
          </h2>
          <p className="text-gray-300 mb-6">Be the first to create a match!</p>
          <Link
            to="/matches/create"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Create a Match
          </Link>
        </div>
      ) : activeTab === "my" && userMatches.length === 0 ? (
        <div className="text-center py-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
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
          <h2 className="text-2xl font-semibold mb-2 text-white">
            Your teams don't have any matches
          </h2>
          <p className="text-gray-300 mb-6">
            Create a match or join a team to see matches here!
          </p>
          <Link
            to="/matches/create"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Create a Match
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === "all" ? matches : userMatches).map((match) => (
            <div
              key={match.id}
              className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {match.title || "Football Match"}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isMatchPast(match.date)
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {isMatchPast(match.date) ? "Completed" : "Upcoming"}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <div className="text-lg font-semibold text-white">
                      {match.homeTeamName || getTeamName(match.homeTeamId)}
                    </div>
                    <div className="text-sm text-gray-400">Home</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold text-white">VS</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg font-semibold text-white">
                      {match.awayTeamName || getTeamName(match.awayTeamId)}
                    </div>
                    <div className="text-sm text-gray-400">Away</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Date & Time:
                    </div>
                    <div className="font-medium text-gray-300">
                      {formatDate(match.date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Stadium:</div>
                    <div className="font-medium text-gray-300">
                      {match.stadiumName || "TBD"}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/matches/${match.id}`}
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
