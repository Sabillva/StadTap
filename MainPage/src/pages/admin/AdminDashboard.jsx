"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const AdminDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStadiumOwners: 0,
    totalReservations: 0,
    totalMatches: 0,
    totalTeams: 0,
  });
  const [users, setUsers] = useState([]);
  const [stadiumOwners, setStadiumOwners] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add state for mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add these modal states after the existing state declarations
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editItemType, setEditItemType] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [viewItemType, setViewItemType] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate("/admin/login");
      return;
    }

    // Load data from localStorage
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const regularUsers = allUsers.filter((u) => u.userType !== "owner");
    const owners = allUsers.filter((u) => u.userType === "owner");
    const allReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    const allMatches = JSON.parse(localStorage.getItem("matches") || "[]");
    const allTeams = JSON.parse(localStorage.getItem("teams") || "[]");

    // Set stats
    setStats({
      totalUsers: regularUsers.length,
      totalStadiumOwners: owners.length,
      totalReservations: allReservations.length,
      totalMatches: allMatches.length,
      totalTeams: allTeams.length,
    });

    // Set data for tables
    setUsers(regularUsers);
    setStadiumOwners(owners);
    setReservations(allReservations);

    setLoading(false);
  }, [user, navigate]);

  const handleLogout = () => {
    // Remove admin from localStorage
    localStorage.removeItem("admin");

    // Update context
    setUser(null);
    navigate("/admin/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time slots for display
  const formatTimeSlots = (timeSlots) => {
    if (!timeSlots || !Array.isArray(timeSlots)) return "N/A";

    return timeSlots
      .map((slot) => {
        const [start, end] = slot.split("-");
        return `${start}:00-${end}:00`;
      })
      .join(", ");
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteItemId || !deleteItemType) return;

    if (deleteItemType === "user") {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = allUsers.filter((user) => user.id !== deleteItemId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(users.filter((user) => user.id !== deleteItemId));
    } else if (deleteItemType === "stadiumOwner") {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = allUsers.filter((user) => user.id !== deleteItemId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setStadiumOwners(
        stadiumOwners.filter((owner) => owner.id !== deleteItemId)
      );
    } else if (deleteItemType === "reservation") {
      const allReservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const updatedReservations = allReservations.filter(
        (res) => res.id !== deleteItemId
      );
      localStorage.setItem("reservations", JSON.stringify(updatedReservations));
      setReservations(reservations.filter((res) => res.id !== deleteItemId));
    }

    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteItemType(null);
  };

  // Handle edit save
  const handleEditSave = (updatedItem) => {
    if (!editItem || !editItemType) return;

    if (editItemType === "user" || editItemType === "stadiumOwner") {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = allUsers.map((user) =>
        user.id === updatedItem.id ? updatedItem : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      if (editItemType === "user") {
        setUsers(
          users.map((user) => (user.id === updatedItem.id ? updatedItem : user))
        );
      } else {
        setStadiumOwners(
          stadiumOwners.map((owner) =>
            owner.id === updatedItem.id ? updatedItem : owner
          )
        );
      }
    } else if (editItemType === "reservation") {
      const allReservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const updatedReservations = allReservations.map((res) =>
        res.id === updatedItem.id ? updatedItem : res
      );
      localStorage.setItem("reservations", JSON.stringify(updatedReservations));
      setReservations(
        reservations.map((res) =>
          res.id === updatedItem.id ? updatedItem : res
        )
      );
    }

    setShowEditModal(false);
    setEditItem(null);
    setEditItemType(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222] flex items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-purple-500"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#2a2a2a] border-b border-gray-700 p-4 flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center text-white hover:text-gray-300"
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || "A"}
            </div>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#333] border border-gray-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/admin/profile");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#444]"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#444]"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      <div
        className={`md:hidden fixed inset-0 z-20 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-[#2a2a2a] border-r border-gray-700 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="mt-4">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 flex items-center ${
                activeTab === "overview"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-[#333]"
              }`}
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
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 flex items-center ${
                activeTab === "users"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-[#333]"
              }`}
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Users
            </button>
            <button
              onClick={() => {
                setActiveTab("stadiumOwners");
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 flex items-center ${
                activeTab === "stadiumOwners"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-[#333]"
              }`}
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Stadium Owners
            </button>
            <button
              onClick={() => {
                setActiveTab("reservations");
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 flex items-center ${
                activeTab === "reservations"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-[#333]"
              }`}
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Reservations
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64 bg-[#2a2a2a] border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-2 flex items-center ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-[#333]"
            }`}
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
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-2 flex items-center ${
              activeTab === "users"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-[#333]"
            }`}
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Users
          </button>
          <button
            onClick={() => setActiveTab("stadiumOwners")}
            className={`w-full text-left px-4 py-2 flex items-center ${
              activeTab === "stadiumOwners"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-[#333]"
            }`}
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Stadium Owners
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`w-full text-left px-4 py-2 flex items-center ${
              activeTab === "reservations"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-[#333]"
            }`}
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Reservations
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header - Desktop */}
        <header className="hidden md:flex bg-[#2a2a2a] border-b border-gray-700 p-4 justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "stadiumOwners" && "Stadium Owner Management"}
            {activeTab === "reservations" && "Reservation Management"}
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center text-white hover:text-gray-300"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                {user?.firstName?.charAt(0) || "A"}
              </div>
              <span>{user?.firstName || "Admin"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#333] border border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin/profile");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#444]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#444]"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-500/20 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-500/20 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Stadium Owners</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalStadiumOwners}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-500/20 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Total Reservations
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalReservations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Users
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {users.slice(0, 5).map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.username}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(user.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Reservations
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Stadium
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {reservations.slice(0, 5).map((reservation) => (
                          <tr key={reservation.id}>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                              {reservation.stadiumName}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {reservation.date}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  reservation.status === "waiting"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : reservation.status === "accepted"
                                    ? "bg-green-500/20 text-green-400"
                                    : reservation.status === "rejected"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {reservation.status === "waiting"
                                  ? "Pending"
                                  : reservation.status === "accepted"
                                  ? "Accepted"
                                  : reservation.status === "rejected"
                                  ? "Rejected"
                                  : "Paid"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                All Users
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.username}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditItem(user);
                              setEditItemType("user");
                              setShowEditModal(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteItemId(user.id);
                              setDeleteItemType("user");
                              setShowDeleteModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "stadiumOwners" && (
            <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Stadium Owners
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Stadium Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {stadiumOwners.map((owner) => (
                      <tr key={owner.id}>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                          {owner.firstName} {owner.lastName}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {owner.stadiumName}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {owner.email}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(owner.createdAt)}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditItem(owner);
                              setEditItemType("stadiumOwner");
                              setShowEditModal(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteItemId(owner.id);
                              setDeleteItemType("stadiumOwner");
                              setShowDeleteModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                All Reservations
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Stadium
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                          {reservation.username}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {reservation.stadiumName}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {reservation.date}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {reservation.totalPrice} AZN
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              reservation.status === "waiting"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : reservation.status === "accepted"
                                ? "bg-green-500/20 text-green-400"
                                : reservation.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {reservation.status === "waiting"
                              ? "Pending"
                              : reservation.status === "accepted"
                              ? "Accepted"
                              : reservation.status === "rejected"
                              ? "Rejected"
                              : "Paid"}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setViewItem(reservation);
                              setViewItemType("reservation");
                              setShowViewModal(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setDeleteItemId(reservation.id);
                              setDeleteItemType("reservation");
                              setShowDeleteModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this {deleteItemType}? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Edit{" "}
              {editItemType === "user"
                ? "User"
                : editItemType === "stadiumOwner"
                ? "Stadium Owner"
                : "Reservation"}
            </h2>

            {(editItemType === "user" || editItemType === "stadiumOwner") && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editItem?.firstName || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editItem?.lastName || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editItem?.email || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {editItemType === "stadiumOwner" && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Stadium Name
                    </label>
                    <input
                      type="text"
                      value={editItem?.stadiumName || ""}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          stadiumName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            )}

            {editItemType === "reservation" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Status
                  </label>
                  <select
                    value={editItem?.status || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="waiting">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditSave(editItem)}
                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Reservation Details
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">User:</p>
                <p className="text-white">{viewItem.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Stadium:</p>
                <p className="text-white">{viewItem.stadiumName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date:</p>
                <p className="text-white">{viewItem.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Time Slots:</p>
                <p className="text-white">
                  {formatTimeSlots(viewItem.timeSlots)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Price:</p>
                <p className="text-white">{viewItem.totalPrice} AZN</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status:</p>
                <p
                  className={`${
                    viewItem.status === "waiting"
                      ? "text-yellow-400"
                      : viewItem.status === "accepted"
                      ? "text-green-400"
                      : viewItem.status === "rejected"
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                >
                  {viewItem.status === "waiting"
                    ? "Pending"
                    : viewItem.status === "accepted"
                    ? "Accepted"
                    : viewItem.status === "rejected"
                    ? "Rejected"
                    : "Paid"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created At:</p>
                <p className="text-white">{formatDate(viewItem.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
