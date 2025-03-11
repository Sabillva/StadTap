"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasRequestedToJoin, setHasRequestedToJoin] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = storedTeams ? JSON.parse(storedTeams) : [];
    const foundTeam = teams.find((t) => t.id === id);

    if (!foundTeam) {
      navigate("/teams");
      return;
    }

    setTeam(foundTeam);
    setIsCreator(foundTeam.creatorId === user.id);
    setIsMember(foundTeam.members.some((member) => member.id === user.id));
    setHasRequestedToJoin(
      foundTeam.joinRequests.some((request) => request.id === user.id)
    );
    setLoading(false);
  }, [id, navigate, user.id]);

  const handleJoinRequest = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          joinRequests: [
            ...t.joinRequests,
            {
              id: user.id,
              username: user.username,
              requestDate: new Date().toISOString(),
              status: "pending",
            },
          ],
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setHasRequestedToJoin(true);
  };

  const handleCancelRequest = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          joinRequests: t.joinRequests.filter(
            (request) => request.id !== user.id
          ),
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setHasRequestedToJoin(false);
  };

  const handleLeaveTeam = () => {
    if (!confirm("Are you sure you want to leave this team?")) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          members: t.members.filter((member) => member.id !== user.id),
          memberCount: t.memberCount - 1,
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    navigate("/teams");
  };

  const handleAcceptRequest = (requestId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        const request = t.joinRequests.find((r) => r.id === requestId);
        return {
          ...t,
          members: [
            ...t.members,
            {
              id: request.id,
              username: request.username,
              status: "accepted",
              joinDate: new Date().toISOString(),
            },
          ],
          joinRequests: t.joinRequests.filter((r) => r.id !== requestId),
          memberCount: t.memberCount + 1,
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeam(updatedTeams.find((t) => t.id === id));
  };

  const handleRejectRequest = (requestId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          joinRequests: t.joinRequests.filter((r) => r.id !== requestId),
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeam(updatedTeams.find((t) => t.id === id));
  };

  const handleRemoveMember = (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          members: t.members.filter((member) => member.id !== memberId),
          memberCount: t.memberCount - 1,
        };
      }
      return t;
    });

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeam(updatedTeams.find((t) => t.id === id));
  };

  const handleDeleteTeam = () => {
    if (!confirm("Are you sure you want to delete this team?")) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = JSON.parse(storedTeams);
    const updatedTeams = teams.filter((t) => t.id !== id);

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    navigate("/teams");
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
        <p className="mt-4 text-gray-300">Loading team details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{team.name}</h1>
              <p className="text-gray-400 mt-1">
                Created by: {team.creatorName}
              </p>
            </div>
            <div className="flex space-x-2">
              {isCreator && (
                <>
                  <Link
                    to={`/teams/edit/${team.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Edit Team
                  </Link>
                  <button
                    onClick={handleDeleteTeam}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
              {isMember && !isCreator && (
                <button
                  onClick={handleLeaveTeam}
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  Leave Team
                </button>
              )}
              {!isMember && !hasRequestedToJoin && (
                <button
                  onClick={handleJoinRequest}
                  className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  Request to Join
                </button>
              )}
              {!isMember && hasRequestedToJoin && (
                <button
                  onClick={handleCancelRequest}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Members:</div>
              <div className="font-medium text-white flex items-center">
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
                {team.memberCount}/{team.maxMembers}
              </div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Contact:</div>
              <div className="font-medium text-white flex items-center">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {team.phoneNumber}
              </div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Created:</div>
              <div className="font-medium text-white">
                {new Date(team.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Description
            </h2>
            <p className="text-gray-300">{team.description}</p>
          </div>

          <div className="mb-4">
            <div className="flex border-b border-gray-700">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "members"
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("members")}
              >
                Members
              </button>
              {isCreator && (
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "requests"
                      ? "text-green-400 border-b-2 border-green-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("requests")}
                >
                  Join Requests
                  {team.joinRequests.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      {team.joinRequests.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {activeTab === "members" && (
            <div className="bg-[#333] rounded-lg p-4">
              {team.members.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No members yet</p>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {team.members.map((member) => (
                    <li
                      key={member.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white">{member.username}</div>
                          <div className="text-xs text-gray-400">
                            {member.id === team.creatorId
                              ? "Team Creator"
                              : "Member"}
                          </div>
                        </div>
                      </div>
                      {isCreator && member.id !== user.id && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="bg-[#333] rounded-lg p-4">
              {team.joinRequests.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No pending join requests
                </p>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {team.joinRequests.map((request) => (
                    <li
                      key={request.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {request.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white">{request.username}</div>
                          <div className="text-xs text-gray-400">
                            Requested:{" "}
                            {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate("/teams")}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Back to Teams
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
