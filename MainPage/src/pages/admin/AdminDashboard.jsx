"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editItemType, setEditItemType] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [viewItemType, setViewItemType] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileMenuRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)",
      borderColor: "rgba(124, 58, 237, 0.3)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: {
      backgroundColor: "rgba(124, 58, 237, 0.05)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

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

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [user, navigate]);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Filter data based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStadiumOwners = stadiumOwners.filter(
    (owner) =>
      owner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.stadiumName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.stadiumName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteItemId || !deleteItemType) return;

    setIsDeleting(true);

    setTimeout(() => {
      if (deleteItemType === "user") {
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = allUsers.filter(
          (user) => user.id !== deleteItemId
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(users.filter((user) => user.id !== deleteItemId));
      } else if (deleteItemType === "stadiumOwner") {
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = allUsers.filter(
          (user) => user.id !== deleteItemId
        );
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
        localStorage.setItem(
          "reservations",
          JSON.stringify(updatedReservations)
        );
        setReservations(reservations.filter((res) => res.id !== deleteItemId));
      }

      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteItemId(null);
      setDeleteItemType(null);
    }, 800);
  };

  // Handle edit save
  const handleEditSave = (updatedItem) => {
    if (!editItem || !editItemType) return;

    setIsSaving(true);

    setTimeout(() => {
      if (editItemType === "user" || editItemType === "stadiumOwner") {
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = allUsers.map((user) =>
          user.id === updatedItem.id ? updatedItem : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        if (editItemType === "user") {
          setUsers(
            users.map((user) =>
              user.id === updatedItem.id ? updatedItem : user
            )
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
        localStorage.setItem(
          "reservations",
          JSON.stringify(updatedReservations)
        );
        setReservations(
          reservations.map((res) =>
            res.id === updatedItem.id ? updatedItem : res
          )
        );
      }

      setIsSaving(false);
      setShowEditModal(false);
      setEditItem(null);
      setEditItemType(null);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-300 text-lg"
          >
            Loading dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0f0f13] flex flex-col md:flex-row"
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-purple-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Mobile Header */}
      <motion.div
        variants={itemVariants}
        className="md:hidden bg-[#161622]/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center"
      >
        <motion.button
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
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
        </motion.button>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <div className="relative" ref={profileMenuRef}>
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center text-white hover:text-gray-300"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user?.firstName?.charAt(0) || "A"}
            </div>
          </motion.button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-[#1c1c2e] border border-white/10 rounded-xl shadow-lg z-10 overflow-hidden"
              >
                <div className="py-1">
                  <motion.button
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin/profile");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Sidebar - Mobile (Overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="md:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-0 left-0 w-64 h-full bg-[#161622]/95 backdrop-blur-md border-r border-white/10 z-30"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={() => setSidebarOpen(false)}
                  className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </motion.button>
              </div>
              <nav className="mt-4 px-2">
                <motion.button
                  whileHover={{
                    backgroundColor:
                      activeTab === "overview"
                        ? "rgba(124, 58, 237, 0.7)"
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab("overview");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-2 ${
                    activeTab === "overview"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                </motion.button>
                <motion.button
                  whileHover={{
                    backgroundColor:
                      activeTab === "users"
                        ? "rgba(124, 58, 237, 0.7)"
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab("users");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-2 ${
                    activeTab === "users"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                </motion.button>
                <motion.button
                  whileHover={{
                    backgroundColor:
                      activeTab === "stadiumOwners"
                        ? "rgba(124, 58, 237, 0.7)"
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab("stadiumOwners");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-2 ${
                    activeTab === "stadiumOwners"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                </motion.button>
                <motion.button
                  whileHover={{
                    backgroundColor:
                      activeTab === "reservations"
                        ? "rgba(124, 58, 237, 0.7)"
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab("reservations");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-2 ${
                    activeTab === "reservations"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  Reservations
                </motion.button>
              </nav>

              {/* Mobile sidebar footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.firstName?.charAt(0) || "A"}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">
                      {user?.firstName || "Admin"} {user?.lastName || ""}
                    </p>
                    <p className="text-gray-400 text-sm">Administrator</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <motion.div
        variants={itemVariants}
        className="hidden md:block w-64 bg-[#161622]/80 backdrop-blur-md border-r border-white/10"
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <nav className="mt-6 px-4">
          <motion.button
            whileHover={{
              backgroundColor:
                activeTab === "overview"
                  ? "rgba(124, 58, 237, 0.7)"
                  : "rgba(255, 255, 255, 0.05)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-3 ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
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
          </motion.button>
          <motion.button
            whileHover={{
              backgroundColor:
                activeTab === "users"
                  ? "rgba(124, 58, 237, 0.7)"
                  : "rgba(255, 255, 255, 0.05)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-3 ${
              activeTab === "users"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
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
          </motion.button>
          <motion.button
            whileHover={{
              backgroundColor:
                activeTab === "stadiumOwners"
                  ? "rgba(124, 58, 237, 0.7)"
                  : "rgba(255, 255, 255, 0.05)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("stadiumOwners")}
            className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-3 ${
              activeTab === "stadiumOwners"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
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
          </motion.button>
          <motion.button
            whileHover={{
              backgroundColor:
                activeTab === "reservations"
                  ? "rgba(124, 58, 237, 0.7)"
                  : "rgba(255, 255, 255, 0.05)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("reservations")}
            className={`w-full text-left px-4 py-3 flex items-center rounded-xl mb-3 ${
              activeTab === "reservations"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
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
          </motion.button>
        </nav>

        {/* Desktop sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user?.firstName?.charAt(0) || "A"}
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">
                {user?.firstName || "Admin"} {user?.lastName || ""}
              </p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Desktop */}
        <motion.header
          variants={itemVariants}
          className="hidden md:flex bg-[#161622]/80 backdrop-blur-md border-b border-white/10 p-6 justify-between items-center"
        >
          <h2 className="text-xl font-semibold text-white">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "stadiumOwners" && "Stadium Owner Management"}
            {activeTab === "reservations" && "Reservation Management"}
          </h2>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
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
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === "users"
                    ? "Search users by name, username, email..."
                    : activeTab === "stadiumOwners"
                    ? "Search stadium owners by name, stadium name, email..."
                    : activeTab === "reservations"
                    ? "Search reservations by user, stadium, date, status..."
                    : "Search..."
                }
                className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center text-white hover:text-gray-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg mr-2">
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
            </motion.button>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-[#1c1c2e] border border-white/10 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  <div className="py-1">
                    <motion.button
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/admin/profile");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Mobile search bar */}
        <motion.div variants={itemVariants} className="md:hidden p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === "users"
                  ? "Search users by name, username, email..."
                  : activeTab === "stadiumOwners"
                  ? "Search stadium owners by name, stadium name, email..."
                  : activeTab === "reservations"
                  ? "Search reservations by user, stadium, date, status..."
                  : "Search..."
              }
              className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  <motion.div
                    variants={cardVariants}
                    custom={0}
                    whileHover="hover"
                    className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
                  >
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
                  </motion.div>
                  <motion.div
                    variants={cardVariants}
                    custom={1}
                    whileHover="hover"
                    className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
                  >
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
                  </motion.div>
                  <motion.div
                    variants={cardVariants}
                    custom={2}
                    whileHover="hover"
                    className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
                  >
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
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    variants={cardVariants}
                    custom={3}
                    whileHover="hover"
                    className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-400"
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
                      Recent Users
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/10">
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
                        <tbody className="divide-y divide-white/10">
                          {users.slice(0, 5).map((user, index) => (
                            <motion.tr
                              key={user.id}
                              custom={index}
                              variants={tableRowVariants}
                              whileHover="hover"
                              className="transition-colors"
                            >
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                                {user.firstName} {user.lastName}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {user.username}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {formatDate(user.createdAt)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    custom={4}
                    whileHover="hover"
                    className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-400"
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
                      Recent Reservations
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/10">
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
                        <tbody className="divide-y divide-white/10">
                          {reservations
                            .slice(0, 5)
                            .map((reservation, index) => (
                              <motion.tr
                                key={reservation.id}
                                custom={index}
                                variants={tableRowVariants}
                                whileHover="hover"
                                className="transition-colors"
                              >
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
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-400"
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
                  All Users
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
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
                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          custom={index}
                          variants={tableRowVariants}
                          whileHover="hover"
                          className="transition-colors"
                        >
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
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setEditItem(user);
                                setEditItemType("user");
                                setShowEditModal(true);
                              }}
                              className="text-purple-400 hover:text-purple-300 mr-3"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setDeleteItemId(user.id);
                                setDeleteItemType("user");
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "stadiumOwners" && (
              <motion.div
                key="stadiumOwners"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-400"
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
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
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
                    <tbody className="divide-y divide-white/10">
                      {filteredStadiumOwners.map((owner, index) => (
                        <motion.tr
                          key={owner.id}
                          custom={index}
                          variants={tableRowVariants}
                          whileHover="hover"
                          className="transition-colors"
                        >
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
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setEditItem(owner);
                                setEditItemType("stadiumOwner");
                                setShowEditModal(true);
                              }}
                              className="text-purple-400 hover:text-purple-300 mr-3"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setDeleteItemId(owner.id);
                                setDeleteItemType("stadiumOwner");
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "reservations" && (
              <motion.div
                key="reservations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#161622]/80 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-4 md:p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-400"
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
                  All Reservations
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
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
                    <tbody className="divide-y divide-white/10">
                      {filteredReservations.map((reservation, index) => (
                        <motion.tr
                          key={reservation.id}
                          custom={index}
                          variants={tableRowVariants}
                          whileHover="hover"
                          className="transition-colors"
                        >
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
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setViewItem(reservation);
                                setViewItemType("reservation");
                                setShowViewModal(true);
                              }}
                              className="text-purple-400 hover:text-purple-300 mr-3"
                            >
                              View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setDeleteItemId(reservation.id);
                                setDeleteItemType("reservation");
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteModal(false)}
            ></motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161622]/95 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-6 max-w-md w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mr-3">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this {deleteItemType}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      ></motion.div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowEditModal(false)}
            ></motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161622]/95 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-6 max-w-md w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Edit{" "}
                  {editItemType === "user"
                    ? "User"
                    : editItemType === "stadiumOwner"
                    ? "Stadium Owner"
                    : "Reservation"}
                </h2>
              </div>

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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(124, 58, 237, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditSave(editItem)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      ></motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && viewItem && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowViewModal(false)}
            ></motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161622]/95 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-lg p-6 max-w-md w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Reservation Details
                </h2>
              </div>

              <div className="space-y-4 bg-white/5 rounded-xl p-4 border border-white/10">
                <div>
                  <p className="text-sm text-gray-400">User:</p>
                  <p className="text-white font-medium">{viewItem.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Stadium:</p>
                  <p className="text-white font-medium">
                    {viewItem.stadiumName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date:</p>
                  <p className="text-white font-medium">{viewItem.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Time Slots:</p>
                  <p className="text-white font-medium">
                    {formatTimeSlots(viewItem.timeSlots)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price:</p>
                  <p className="text-white font-medium">
                    {viewItem.totalPrice} AZN
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status:</p>
                  <p
                    className={`font-medium ${
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
                  <p className="text-white font-medium">
                    {formatDate(viewItem.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(124, 58, 237, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
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
                  Close
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
