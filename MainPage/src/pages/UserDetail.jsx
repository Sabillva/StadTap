"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = storedUsers.find((u) => u.id === id);

    if (!foundUser) {
      navigate("/users");
      return;
    }

    setUser(foundUser);
    setLoading(false);
  }, [id, navigate]);

  const handleSendMessage = () => {
    navigate(`/chat/${id}`);
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
        <p className="mt-4 text-gray-300">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
              {user.firstName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#333] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Email:</div>
            <div className="font-medium text-white">{user.email}</div>
          </div>
          <div className="bg-[#333] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">User Type:</div>
            <div className="font-medium text-white">
              {user.userType === "owner" ? "Stadium Owner" : "Regular User"}
            </div>
          </div>
        </div>

        {user.userType === "owner" && user.stadiumName && (
          <div className="mb-6">
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Stadium:</div>
              <div className="font-medium text-white">{user.stadiumName}</div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Send a Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
