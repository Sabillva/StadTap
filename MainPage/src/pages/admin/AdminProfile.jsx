"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../App";

const AdminProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
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

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate("/admin/login");
      return;
    }

    // Load admin data
    const adminData = JSON.parse(localStorage.getItem("admin") || "{}");

    setFormData({
      firstName: adminData.firstName || "",
      lastName: adminData.lastName || "",
      email: adminData.email || "",
      username: adminData.username || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Only validate password fields if the user is trying to change password
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to change password";
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to update admin profile
    setTimeout(() => {
      // Get current admin data
      const admins = JSON.parse(localStorage.getItem("admins") || "[]");
      const adminIndex = admins.findIndex((a) => a.id === user.id);

      if (adminIndex === -1) {
        setErrors({ general: "Admin not found" });
        setIsSubmitting(false);
        return;
      }

      // Check current password if trying to change password
      if (formData.currentPassword) {
        if (admins[adminIndex].password !== formData.currentPassword) {
          setErrors({ currentPassword: "Current password is incorrect" });
          setIsSubmitting(false);
          return;
        }
      }

      // Update admin data
      const updatedAdmin = {
        ...admins[adminIndex],
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
      };

      // Update password if provided
      if (formData.newPassword) {
        updatedAdmin.password = formData.newPassword;
      }

      admins[adminIndex] = updatedAdmin;
      localStorage.setItem("admins", JSON.stringify(admins));

      // Update admin in localStorage
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));

      // Update context
      setUser({
        ...updatedAdmin,
        isAdmin: true,
      });

      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsSubmitting(false);
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    // Simulate API call to delete admin account
    setTimeout(() => {
      // Get current admin data
      const admins = JSON.parse(localStorage.getItem("admins") || "[]");
      const updatedAdmins = admins.filter((a) => a.id !== user.id);

      localStorage.setItem("admins", JSON.stringify(updatedAdmins));
      localStorage.removeItem("admin");

      // Redirect to login
      navigate("/admin/login");
    }, 1000);
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
            Loading profile...
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
      className="min-h-screen bg-[#0a0a12] py-12 px-4 sm:px-6 lg:px-8"
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

      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-3">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Admin Profile
            </h1>
          </div>
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </motion.button>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#16162a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden relative"
        >
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>

          <form onSubmit={handleSubmit}>
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-white mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-white/10"
                  } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-white/10"
                  } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-white/10"
                } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-white/10"
                } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="border-t border-white/10 pt-6 mt-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg mr-2">
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Change Password
                </h2>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.currentPassword
                        ? "border-red-500"
                        : "border-white/10"
                    } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
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
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.newPassword ? "border-red-500" : "border-white/10"
                    } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-white/10"
                    } bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between mt-8 gap-4"
            >
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Account
              </motion.button>

              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
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
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteConfirm(false)}
            ></motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1a2e]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 max-w-md w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Delete Account</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your admin account? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/5 text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProfile;
