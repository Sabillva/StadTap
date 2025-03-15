"use client";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  // Add a state for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Add a function to handle account deletion
  const handleDeleteAccount = () => {
    // Remove user from localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const updatedUsers = users.filter((u) => u.id !== user.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Clear current user session
    localStorage.removeItem("user");

    // Log out the user
    setUser(null);

    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const userProfile = users.find((u) => u.id === user.id);

    if (userProfile) {
      setProfile(userProfile);
    }

    // Get user's teams
    const storedTeams = localStorage.getItem("teams");
    const allTeams = storedTeams ? JSON.parse(storedTeams) : [];
    const userTeams = allTeams.filter((team) =>
      team.members.some((member) => member.id === user.id)
    );
    setTeams(userTeams);

    // Get user's reservations
    const storedReservations = localStorage.getItem("reservations");
    const allReservations = storedReservations
      ? JSON.parse(storedReservations)
      : [];
    const userReservations = allReservations
      .filter((r) => r.userId === user.id)
      .slice(0, 3); // Get only the 3 most recent
    setReservations(userReservations);

    // Get user's matches
    const storedMatches = localStorage.getItem("matches");
    const allMatches = storedMatches ? JSON.parse(storedMatches) : [];

    // Filter matches where user's team is participating
    const userMatches = allMatches
      .filter((match) => {
        return userTeams.some(
          (team) => team.id === match.homeTeamId || team.id === match.awayTeamId
        );
      })
      .slice(0, 3); // Get only the 3 most recent
    setMatches(userMatches);

    setLoading(false);
  }, [user.id, navigate, setUser]);

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
        <p className="mt-4 text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                  {user.firstName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-400">@{user.username}</p>
                  <p className="text-gray-400 mt-1">{user.email}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                      {user.userType === "owner" ? "Stadium Owner" : "Player"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/profile/edit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">My Teams</h2>
            {teams.length === 0 ? (
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-400 mb-4">
                  You haven't joined any teams yet
                </p>
                <Link
                  to="/teams/create"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Create a Team
                </Link>
              </div>
            ) : (
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-700">
                  {teams.map((team) => (
                    <li key={team.id} className="p-4 hover:bg-[#333]">
                      <Link to={`/teams/${team.id}`} className="block">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {team.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {team.memberCount} members
                            </p>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t border-gray-700">
                  <Link
                    to="/teams"
                    className="text-green-400 hover:text-green-300 flex items-center justify-center"
                  >
                    View All Teams
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">
              Recent Matches
            </h2>
            {matches.length === 0 ? (
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-400 mb-4">No recent matches</p>
                <Link
                  to="/matches/create"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Create a Match
                </Link>
              </div>
            ) : (
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-700">
                  {matches.map((match) => (
                    <li key={match.id} className="p-4 hover:bg-[#333]">
                      <Link to={`/matches/${match.id}`} className="block">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {match.homeTeamName} vs {match.awayTeamName}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {new Date(match.date).toLocaleDateString()}
                            </p>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t border-gray-700">
                  <Link
                    to="/matches"
                    className="text-green-400 hover:text-green-300 flex items-center justify-center"
                  >
                    View All Matches
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Recent Reservations
            </h2>
            {reservations.length === 0 ? (
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-400 mb-4">
                  You haven't made any reservations yet
                </p>
                <Link
                  to="/reserve"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Make a Reservation
                </Link>
              </div>
            ) : (
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-700">
                  {reservations.map((reservation) => (
                    <li key={reservation.id} className="p-4 hover:bg-[#333]">
                      <Link to="/my-reservations" className="block">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {reservation.stadiumName}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {reservation.date} - {reservation.totalPrice} AZN
                            </p>
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  reservation.status === "waiting"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : reservation.status === "accepted"
                                    ? "bg-green-500/20 text-green-400"
                                    : reservation.status === "rejected"
                                    ? "bg-red-500/20 text-red-400"
                                    : reservation.status === "paid"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {reservation.status === "waiting"
                                  ? "Waiting"
                                  : reservation.status === "accepted"
                                  ? "Accepted"
                                  : reservation.status === "rejected"
                                  ? "Rejected"
                                  : reservation.status === "paid"
                                  ? "Paid"
                                  : reservation.status}
                              </span>
                            </div>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t border-gray-700">
                  <Link
                    to="/my-reservations"
                    className="text-green-400 hover:text-green-300 flex items-center justify-center"
                  >
                    View All Reservations
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {user.userType === "owner" && (
              <>
                <h2 className="text-2xl font-semibold mb-4 mt-8 text-white">
                  Stadium Owner
                </h2>
                <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
                  <p className="text-gray-300 mb-2">
                    You are registered as the owner of{" "}
                    <span className="font-semibold text-green-400">
                      {user.stadiumName}
                    </span>
                    .
                  </p>
                  <p className="text-gray-300 mb-4">
                    Manage your stadium reservations and requests from the
                    dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal - Updated with semi-transparent background */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Delete Account
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
