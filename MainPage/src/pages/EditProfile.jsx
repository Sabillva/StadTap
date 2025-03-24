"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    stadiumName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeSection, setActiveSection] = useState("basic"); // basic, password

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const userProfile = users.find((u) => u.id === user.id);

    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        username: userProfile.username,
        password: "",
        newPassword: "",
        confirmPassword: "",
        stadiumName: userProfile.stadiumName || "",
      });
    }
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
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

    if (user.userType === "owner" && !formData.stadiumName?.trim()) {
      newErrors.stadiumName = "Stadium name is required for stadium owners";
    }

    if (changePassword) {
      if (!formData.password) {
        newErrors.password = "Current password is required";
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (!validatePassword(formData.newPassword)) {
        newErrors.newPassword =
          "Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number";
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

    if (!validateForm()) return;

    setIsSubmitting(true);

    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    setTimeout(() => {
      const storedUsers = localStorage.getItem("users");
      const users = JSON.parse(storedUsers);

      // Check if username is already taken by another user
      const usernameExists = users.some(
        (u) => u.username === formData.username && u.id !== user.id
      );

      if (usernameExists) {
        setErrors({ username: "This username is already taken" });
        setIsSubmitting(false);
        return;
      }

      // Check current password if changing password
      if (changePassword) {
        const currentUser = users.find((u) => u.id === user.id);
        if (currentUser.password !== formData.password) {
          setErrors({ password: "Current password is incorrect" });
          setIsSubmitting(false);
          return;
        }
      }

      // Update user data
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          return {
            ...u,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.username,
            password: changePassword ? formData.newPassword : u.password,
            stadiumName:
              user.userType === "owner" ? formData.stadiumName : u.stadiumName,
          };
        }
        return u;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update user in context and localStorage
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setIsSubmitting(false);
      navigate("/profile");
    }, 1000);
  };

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
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(77, 232, 64, 0.1)",
      borderColor: "rgba(77, 232, 64, 0.3)",
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

  const tabVariants = {
    inactive: {
      opacity: 0.7,
      y: 0,
    },
    active: {
      opacity: 1,
      y: 0,
      color: "#4de840",
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      opacity: 1,
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#fffce1]"
          >
            Edit Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#fffce1]/70 mt-2"
          >
            Update your personal information and account settings
          </motion.p>
        </motion.div>

        {/* Main content */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] shadow-lg overflow-hidden"
        >
          {/* Tabs for navigation */}
          <div className="border-b border-white/10">
            <div className="flex px-6 pt-6">
              <motion.button
                variants={tabVariants}
                initial="inactive"
                animate={activeSection === "basic" ? "active" : "inactive"}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection("basic")}
                className="px-4 py-2 font-medium transition-all duration-300 cursor-pointer relative"
              >
                Basic Information
                {activeSection === "basic" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4de840]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>

              <motion.button
                variants={tabVariants}
                initial="inactive"
                animate={activeSection === "password" ? "active" : "inactive"}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveSection("password");
                  setChangePassword(true);
                }}
                className="px-4 py-2 font-medium transition-all duration-300 cursor-pointer relative"
              >
                Password and Security
                {activeSection === "password" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4de840]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeSection === "basic" ? (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
                              errors.firstName
                                ? "border-rose-500/50"
                                : "border-white/10 focus:border-[#4de840]/50"
                            } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                            required
                          />
                          {errors.firstName && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-rose-400"
                          >
                            {errors.firstName}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
                              errors.lastName
                                ? "border-rose-500/50"
                                : "border-white/10 focus:border-[#4de840]/50"
                            } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                            required
                          />
                          {errors.lastName && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-rose-400"
                          >
                            {errors.lastName}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.email
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                          required
                        />
                        {errors.email && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.username
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                          required
                        />
                        {errors.username && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.username}
                        </motion.p>
                      )}
                    </div>

                    {user.userType === "owner" && (
                      <div>
                        <label
                          htmlFor="stadiumName"
                          className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                        >
                          Stadium Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="stadiumName"
                            name="stadiumName"
                            value={formData.stadiumName || ""}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                              errors.stadiumName
                                ? "border-rose-500/50"
                                : "border-white/10 focus:border-[#4de840]/50"
                            } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                            required
                          />
                          {errors.stadiumName && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                        {errors.stadiumName && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-rose-400"
                          >
                            {errors.stadiumName}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#4de840]/5 border border-[#4de840]/20 rounded-xl p-4 mb-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#4de840]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-[#fffce1]">
                            Password must be at least 8 characters with at least
                            one uppercase letter, one lowercase letter, and one
                            number.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.password
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                        />
                        {errors.password && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.newPassword
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                        />
                        {errors.newPassword && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 ${
                            errors.confirmPassword
                              ? "border-rose-500/50"
                              : "border-white/10 focus:border-[#4de840]/50"
                          } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none transition-all duration-300`}
                        />
                        {errors.confirmPassword && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-400"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form actions */}
            <div className="p-6 border-t border-white/10 flex flex-wrap justify-between gap-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-5 py-2.5 bg-[rgb(25,25,25)] border-2 border-white/10 text-[#fffce1] rounded-full hover:border-white/30 transition-all duration-300 flex items-center hover:bg-[rgb(26,26,26)] cursor-pointer"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Profile
                </motion.button>

                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 flex items-center cursor-pointer"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Account
                </motion.button>
              </div>

              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center cursor-pointer ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
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
                      className="w-4 h-4 border-2 border-[#0e100f] border-t-transparent rounded-full mr-2"
                    ></motion.div>
                    Saving Changes...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            ></motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0e100f]/90 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg p-6 max-w-md w-full z-50"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mr-3">
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
                <h2 className="text-xl font-bold text-[#fffce1]">
                  Delete Account
                </h2>
              </div>
              <p className="text-[#fffce1]/70 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-[#171717]/60 border-2 border-white/10 text-[#fffce1] rounded-full hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[rgb(25,25,25)]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 rounded-full hover:bg-rose-500/20 transition-all duration-300 cursor-pointer"
                >
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

export default EditProfile;
