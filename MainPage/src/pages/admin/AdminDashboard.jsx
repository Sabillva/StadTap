"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../App";

const AdminDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
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

  // New animation variants for stats cards
  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like effect
      },
    }),
    hover: {
      boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.2)",
      transition: {
        duration: 0.3,
      },
    },
  };

  // Animation for stat numbers
  const countAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  // Pulse animation for highlights
  const pulseAnimation = {
    initial: { opacity: 0.7, scale: 1 },
    animate: {
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
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
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
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
            className="w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-300 text-base"
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
      className="min-h-screen bg-[#0a0a12] flex flex-col md:flex-row"
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            transition: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-purple-600/5 rounded-full blur-[120px]"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            transition: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            },
          }}
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/5 rounded-full blur-[120px]"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            transition: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            },
          }}
          className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[100px]"
        ></motion.div>
      </div>

      {/* Mobile Header */}
      <motion.div
        variants={itemVariants}
        className="md:hidden bg-[#12121e]/90 backdrop-blur-md border-b border-white/10 p-3 flex justify-between items-center shadow-lg"
      >
        <motion.button
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>
        <div className="flex items-center">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-base font-bold text-white">Admin Panel</h1>
        </div>
        <div className="relative">
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={() => navigate("/admin/profile")}
            className="flex items-center text-white hover:text-gray-300 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </motion.button>
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
              className="md:hidden fixed top-0 left-0 w-64 h-full bg-[#12121e]/95 backdrop-blur-md border-r border-white/10 z-30 shadow-xl"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-base font-bold text-white">
                    Admin Panel
                  </h1>
                </div>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={() => setSidebarOpen(false)}
                  className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
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

              <nav className="mt-6 px-2">
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
                  className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
                    activeTab === "overview"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2.5"
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
                  <span className="text-sm">Overview</span>
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
                  className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
                    activeTab === "users"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2.5"
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
                  <span className="text-sm">Users</span>
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
                  className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
                    activeTab === "stadiumOwners"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2.5"
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
                  <span className="text-sm">Stadium Owners</span>
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
                  className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
                    activeTab === "reservations"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2.5"
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
                  <span className="text-sm">Reservations</span>
                </motion.button>
              </nav>

              {/* Logout button in mobile sidebar */}
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
                >
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
                  <span className="text-sm">Sign out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <motion.div
        variants={itemVariants}
        className="hidden md:block w-60 bg-[#12121e]/90 backdrop-blur-md border-r border-white/10 shadow-xl"
      >
        <div className="p-4 border-b border-white/10 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-base font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="mt-6 px-3">
          <motion.button
            whileHover={{
              backgroundColor:
                activeTab === "overview"
                  ? "rgba(124, 58, 237, 0.7)"
                  : "rgba(255, 255, 255, 0.05)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2.5"
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
            <span className="text-sm">Overview</span>
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
            className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
              activeTab === "users"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2.5"
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
            <span className="text-sm">Users</span>
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
            className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
              activeTab === "stadiumOwners"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2.5"
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
            <span className="text-sm">Stadium Owners</span>
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
            className={`w-full text-left px-4 py-2.5 flex items-center rounded-lg mb-1.5 ${
              activeTab === "reservations"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/5"
            } transition-colors cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2.5"
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
            <span className="text-sm">Reservations</span>
          </motion.button>
        </nav>

        {/* Logout button in desktop sidebar */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
          >
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
            <span className="text-sm">Sign out</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Desktop */}
        <motion.header
          variants={itemVariants}
          className="hidden md:flex bg-[#12121e]/90 backdrop-blur-md border-b border-white/10 p-4 justify-between items-center shadow-lg"
        >
          <h2 className="text-base font-semibold text-white">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "stadiumOwners" && "Stadium Owner Management"}
            {activeTab === "reservations" && "Reservation Management"}
          </h2>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-6">
            {activeTab !== "overview" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
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
                  className="block w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => navigate("/admin/profile")}
              className="flex items-center text-white hover:text-gray-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm">{user?.firstName || "Admin"}</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Mobile search bar */}
        <motion.div variants={itemVariants} className="md:hidden p-3">
          {activeTab !== "overview" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
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
                className="block w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}
        </motion.div>

        {/* Content */}
        <main className="flex-1 p-3 md:p-5 overflow-auto">
          <div className="max-w-full overflow-x-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stats Cards - Completely redesigned */}
                  {/* Stats Cards bölməsini daha da kiçildək */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {/* Users Card */}
                    <motion.div
                      variants={statCardVariants}
                      custom={0}
                      whileHover="hover"
                      className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl shadow-xl border border-white/5"
                    >
                      {/* Decorative elements */}
                      <motion.div
                        variants={floatingAnimation}
                        initial="initial"
                        animate="animate"
                        className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
                      ></motion.div>
                      <motion.div
                        variants={pulseAnimation}
                        initial="initial"
                        animate="animate"
                        className="absolute -left-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full blur-lg"
                      ></motion.div>

                      {/* Kartların içindəki padding və ölçüləri kiçildək */}
                      <div className="p-3 relative z-10">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
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
                          <div className="ml-2">
                            <h3 className="text-sm font-bold text-white">
                              Users
                            </h3>
                            <p className="text-blue-300/70 text-xs">
                              Registered accounts
                            </p>
                          </div>
                        </div>
                        <motion.div
                          variants={countAnimation}
                          className="text-2xl font-bold text-white mt-1"
                        >
                          {stats.totalUsers}
                        </motion.div>
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <div className="flex items-center text-blue-300/70 text-xs">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                              <polyline points="16 7 22 7 22 13"></polyline>
                            </svg>
                            <span>Active platform users</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Stadium Owners Card */}
                    <motion.div
                      variants={statCardVariants}
                      custom={1}
                      whileHover="hover"
                      className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl shadow-xl border border-white/5"
                    >
                      {/* Decorative elements */}
                      <motion.div
                        variants={floatingAnimation}
                        initial="initial"
                        animate="animate"
                        className="absolute -right-8 -top-8 w-24 h-24 bg-green-500/10 rounded-full blur-xl"
                      ></motion.div>
                      <motion.div
                        variants={pulseAnimation}
                        initial="initial"
                        animate="animate"
                        className="absolute -left-4 -bottom-4 w-20 h-20 bg-green-500/5 rounded-full blur-lg"
                      ></motion.div>

                      {/* İkinci kart (Stadium Owners) üçün eyni dəyişikliklər */}
                      <div className="p-3 relative z-10">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
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
                          <div className="ml-2">
                            <h3 className="text-sm font-bold text-white">
                              Stadium Owners
                            </h3>
                            <p className="text-green-300/70 text-xs">
                              Venue providers
                            </p>
                          </div>
                        </div>
                        <motion.div
                          variants={countAnimation}
                          className="text-2xl font-bold text-white mt-1"
                        >
                          {stats.totalStadiumOwners}
                        </motion.div>
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <div className="flex items-center text-green-300/70 text-xs">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                              <polyline points="16 7 22 7 22 13"></polyline>
                            </svg>
                            <span>Active venue partners</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Reservations Card */}
                    <motion.div
                      variants={statCardVariants}
                      custom={2}
                      whileHover="hover"
                      className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl shadow-xl border border-white/5"
                    >
                      {/* Decorative elements */}
                      <motion.div
                        variants={floatingAnimation}
                        initial="initial"
                        animate="animate"
                        className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
                      ></motion.div>
                      <motion.div
                        variants={pulseAnimation}
                        initial="initial"
                        animate="animate"
                        className="absolute -left-4 -bottom-4 w-20 h-20 bg-purple-500/5 rounded-full blur-lg"
                      ></motion.div>

                      {/* Üçüncü kart (Reservations) üçün eyni dəyişikliklər */}
                      <div className="p-3 relative z-10">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
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
                          <div className="ml-2">
                            <h3 className="text-sm font-bold text-white">
                              Reservations
                            </h3>
                            <p className="text-purple-300/70 text-xs">
                              Total bookings
                            </p>
                          </div>
                        </div>
                        <motion.div
                          variants={countAnimation}
                          className="text-2xl font-bold text-white mt-1"
                        >
                          {stats.totalReservations}
                        </motion.div>
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <div className="flex items-center text-purple-300/70 text-xs">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                              <polyline points="16 7 22 7 22 13"></polyline>
                            </svg>
                            <span>Completed reservations</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div
                      variants={cardVariants}
                      custom={3}
                      whileHover="hover"
                      className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16162a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-5 overflow-hidden relative"
                    >
                      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
                      <h3 className="text-base font-semibold text-white mb-4 flex items-center relative z-10">
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
                      <div className="overflow-x-auto -mx-4 px-4">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Username
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                                className="transition-colors cursor-pointer"
                              >
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                                  {user.firstName} {user.lastName}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                                  {user.username}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
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
                      className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16162a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-5 overflow-hidden relative"
                    >
                      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
                      <h3 className="text-base font-semibold text-white mb-4 flex items-center relative z-10">
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
                      <div className="overflow-x-auto -mx-4 px-4">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Stadium
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                                  className="transition-colors cursor-pointer"
                                >
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                                    {reservation.stadiumName}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                                    {reservation.date}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <span
                                      className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full 
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
                  className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16162a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-5 overflow-hidden relative"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center relative z-10">
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
                  <div className="overflow-x-auto -mx-4 px-4">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {user.username}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setEditItem(user);
                                  setEditItemType("user");
                                  setShowEditModal(true);
                                }}
                                className="text-purple-400 hover:text-purple-300 mr-2 cursor-pointer"
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
                                className="text-red-400 hover:text-red-300 cursor-pointer"
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
                  className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16162a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-5 overflow-hidden relative"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-500/5 rounded-full blur-xl"></div>
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center relative z-10">
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
                  <div className="overflow-x-auto -mx-4 px-4">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Stadium Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                              {owner.firstName} {owner.lastName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {owner.stadiumName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {owner.email}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {formatDate(owner.createdAt)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setEditItem(owner);
                                  setEditItemType("stadiumOwner");
                                  setShowEditModal(true);
                                }}
                                className="text-purple-400 hover:text-purple-300 mr-2 cursor-pointer relative z-10"
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
                                className="text-red-400 hover:text-red-300 cursor-pointer relative z-10"
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
                  className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16162a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-5 overflow-hidden relative"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center relative z-10">
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
                  <div className="overflow-x-auto -mx-4 px-4">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Stadium
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                              {reservation.username}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {reservation.stadiumName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {reservation.date}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">
                              {reservation.totalPrice} AZN
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span
                                className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full 
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
                            <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setViewItem(reservation);
                                  setViewItemType("reservation");
                                  setShowViewModal(true);
                                }}
                                className="text-purple-400 hover:text-purple-300 mr-2 cursor-pointer"
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
                                className="text-red-400 hover:text-red-300 cursor-pointer"
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
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Delete Confirmation Modal overlay */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9000]"
              onClick={() => setShowDeleteModal(false)}
            ></motion.div>
            {/* Delete Confirmation Modal content */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#12121e]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-5 max-w-md w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 mr-3">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-white">
                  Confirm Delete
                </h2>
              </div>
              <p className="text-gray-300 text-sm mb-5">
                Are you sure you want to delete this {deleteItemType}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-1.5 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center cursor-pointer"
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
                        className="w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-2"
                      ></motion.div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
            {/* Edit Modal overlay */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9000]"
              onClick={() => setShowEditModal(false)}
            ></motion.div>
            {/* Edit Modal content */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#12121e]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-5 max-w-md w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-white">
                  Edit{" "}
                  {editItemType === "user"
                    ? "User"
                    : editItemType === "stadiumOwner"
                    ? "Stadium Owner"
                    : "Reservation"}
                </h2>
              </div>

              {(editItemType === "user" || editItemType === "stadiumOwner") && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editItem?.firstName || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, firstName: e.target.value })
                      }
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editItem?.lastName || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, lastName: e.target.value })
                      }
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editItem?.email || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, email: e.target.value })
                      }
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {editItemType === "stadiumOwner" && (
                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
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
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              {editItemType === "reservation" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">
                      Status
                    </label>
                    <select
                      value={editItem?.status || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, status: e.target.value })
                      }
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="waiting">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-5">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center cursor-pointer"
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
                        className="w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-2"
                      ></motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
            {/* View Modal overlay */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9000]"
              onClick={() => setShowViewModal(false)}
            ></motion.div>
            {/* View Modal content */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#12121e]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-5 max-w-md w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
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
                <h2 className="text-base font-bold text-white">
                  Reservation Details
                </h2>
              </div>

              <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
                <div>
                  <p className="text-xs text-gray-400">User:</p>
                  <p className="text-sm text-white font-medium">
                    {viewItem.username}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Stadium:</p>
                  <p className="text-sm text-white font-medium">
                    {viewItem.stadiumName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date:</p>
                  <p className="text-sm text-white font-medium">
                    {viewItem.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Time Slots:</p>
                  <p className="text-sm text-white font-medium">
                    {formatTimeSlots(viewItem.timeSlots)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Price:</p>
                  <p className="text-sm text-white font-medium">
                    {viewItem.totalPrice} AZN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status:</p>
                  <p
                    className={`text-sm font-medium ${
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
                  <p className="text-xs text-gray-400">Created At:</p>
                  <p className="text-sm text-white font-medium">
                    {formatDate(viewItem.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(124, 58, 237, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowViewModal(false)}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
