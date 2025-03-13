"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const Teams = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const allTeams = storedTeams ? JSON.parse(storedTeams) : [];

    // Sort teams by creation date (newest first)
    allTeams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setTeams(allTeams);

    // Filter teams where user is a member or creator
    const myTeams = allTeams.filter(
      (team) =>
        team.members.some((member) => member.id === user.id) ||
        team.creatorId === user.id
    );
    setUserTeams(myTeams);

    setLoading(false);
  }, [user.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Teams</h1>
        <Link
          to="/teams/create"
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          Create Team
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
            All Teams
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "my"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Teams
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
          <p className="mt-4 text-gray-300">Loading teams...</p>
        </div>
      ) : activeTab === "all" && teams.length === 0 ? (
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
            No teams found
          </h2>
          <p className="text-gray-300 mb-6">
            Be the first to create a team and invite players!
          </p>
          <Link
            to="/teams/create"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Create a Team
          </Link>
        </div>
      ) : activeTab === "my" && userTeams.length === 0 ? (
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
            You're not in any teams
          </h2>
          <p className="text-gray-300 mb-6">
            Create your own team or join an existing one!
          </p>
          <Link
            to="/teams/create"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Create a Team
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === "all" ? teams : userTeams).map((team) => (
            <div
              key={team.id}
              className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {team.name}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {team.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-gray-300">
                      {team.memberCount}/{team.maxMembers} members
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Created by: {team.creatorName}
                  </div>
                </div>
                <Link
                  to={`/teams/${team.id}`}
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  View Team
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
