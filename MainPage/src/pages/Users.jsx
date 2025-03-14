"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Filter out the current user and admin users
    const otherUsers = storedUsers.filter(
      (u) => u.id !== user.id && u.userType !== "admin" && !u.isAdmin
    );

    setUsers(otherUsers);
    setFilteredUsers(otherUsers);
    setLoading(false);
  }, [user.id]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
        <p className="mt-4 text-gray-300">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Users</h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or username..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 bg-[#333] border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
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
            No users found
          </h2>
          <p className="text-gray-300 mb-6">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden hover:border-green-500 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {user.firstName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>
                </div>

                {user.userType === "owner" && (
                  <div className="mb-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                      Stadium Owner
                    </span>
                    {user.stadiumName && (
                      <p className="text-gray-300 mt-1">{user.stadiumName}</p>
                    )}
                  </div>
                )}

                <Link
                  to={`/users/${user.id}`}
                  className="block w-full text-center bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
