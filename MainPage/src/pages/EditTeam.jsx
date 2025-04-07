"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: 5,
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = storedTeams ? JSON.parse(storedTeams) : [];
    const team = teams.find((t) => t.id === id);

    if (!team) {
      navigate("/teams");
      return;
    }

    // Check if user is the creator
    if (team.creatorId !== user.id) {
      navigate(`/teams/${id}`);
      return;
    }

    setFormData({
      name: team.name,
      description: team.description,
      maxMembers: team.maxMembers,
      phoneNumber: team.phoneNumber || "",
    });

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [id, navigate, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxMembers") {
      // Ensure maxMembers is between 1 and 10
      const numValue = Number.parseInt(value);
      if (numValue < 1) return;
      if (numValue > 10) return;
    }

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^\+?[0-9\s]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Update team
    setTimeout(() => {
      const storedTeams = localStorage.getItem("teams");
      const teams = JSON.parse(storedTeams);
      const updatedTeams = teams.map((team) => {
        if (team.id === id) {
          return {
            ...team,
            name: formData.name,
            description: formData.description,
            maxMembers: Number.parseInt(formData.maxMembers),
            phoneNumber: formData.phoneNumber,
            updatedAt: new Date().toISOString(),
          };
        }
        return team;
      });

      localStorage.setItem("teams", JSON.stringify(updatedTeams));

      setIsSubmitting(false);
      setShowSuccessMessage(true);

      // Navigate after showing success message
      setTimeout(() => {
        navigate(`/teams/${id}`);
      }, 1500);
    }, 1000);
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
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
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

  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
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
            className="w-16 h-16 border-4 border-[#4de840] border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-[#fffce1]/70 text-lg"
          >
            Loading team details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-[#4de840]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(`/teams/${id}`)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to team details"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-[#fffce1] mb-2 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Team Name <span className="text-[#4de840] ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                      errors.name ? "border-rose-500" : "border-white/15"
                    } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    required
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-rose-400 flex items-center"
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-[#fffce1] mb-2 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Description <span className="text-[#4de840] ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                      errors.description ? "border-rose-500" : "border-white/15"
                    } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    placeholder="Describe your team, what kind of players you're looking for, etc."
                    required
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-xs text-[#fffce1]/50">
                    {formData.description.length} characters
                  </div>
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-rose-400 flex items-center"
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {errors.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Redesigned member count section */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="maxMembers"
                  className="text-sm font-medium text-[#fffce1] mb-2 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
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
                  Maximum Members
                </label>

                <div className="bg-[rgb(25,25,25)] border border-white/15 rounded-xl p-4 mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(formData.maxMembers, 5))].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-[#4de840]/20 border border-[#4de840]/30 flex items-center justify-center text-[#4de840] text-xs"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
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
                            </div>
                          )
                        )}
                        {formData.maxMembers > 5 && (
                          <div className="w-8 h-8 rounded-full bg-[#4de840]/10 border border-[#4de840]/20 flex items-center justify-center text-[#4de840] text-xs">
                            +{formData.maxMembers - 5}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="text-[#fffce1] text-lg font-medium">
                          {formData.maxMembers}
                        </span>
                        <span className="text-[#fffce1]/50 text-sm ml-1">
                          members
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        type="button"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        onClick={() => {
                          if (formData.maxMembers > 1) {
                            setFormData({
                              ...formData,
                              maxMembers: formData.maxMembers - 1,
                            });
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-xl hover:border-[#4de840]/30 hover:text-[#e84040] transition-all duration-300 cursor-pointer"
                        disabled={formData.maxMembers <= 1}
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
                            d="M20 12H4"
                          />
                        </svg>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        onClick={() => {
                          if (formData.maxMembers < 10) {
                            setFormData({
                              ...formData,
                              maxMembers: formData.maxMembers + 1,
                            });
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-white/10 text-[#fffce1] rounded-xl hover:border-[#4de840]/30 hover:text-[#4de840] transition-all duration-300 cursor-pointer"
                        disabled={formData.maxMembers >= 10}
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(formData.maxMembers / 10) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-[#4de840]"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-[#fffce1]/50">
                    <span>Min: 1</span>
                    <span>Max: 10</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-[#fffce1] mb-2 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
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
                  Phone Number <span className="text-[#4de840] ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                      errors.phoneNumber ? "border-rose-500" : "border-white/15"
                    } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    placeholder="+994 XX XXX XX XX"
                    required
                  />
                  <AnimatePresence>
                    {errors.phoneNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-rose-400 flex items-center"
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {errors.phoneNumber}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Redesigned buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-end gap-4 pt-6"
              >
                <motion.button
                  type="button"
                  onClick={() => navigate(`/teams/${id}`)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="px-6 py-3 bg-[rgb(25,25,25)] border-2 border-white/15 text-[#fffce1] rounded-full hover:border-white/30 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-[rgb(26,26,26)]"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : "hover"}
                  whileTap={isSubmitting ? {} : "tap"}
                  variants={buttonVariants}
                  className={`px-6 py-3 bg-[#4de840] text-[#0e100f] rounded-full hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center justify-center font-medium cursor-pointer ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#0e100f]"
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
                      Updating...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Update Team
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </form>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#4de840] mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-[#fffce1]">
              Team Management Tips
            </h3>
          </div>
          <div className="mt-4 text-[#fffce1]/70 space-y-3">
            <p className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#4de840] mr-2 flex-shrink-0 mt-0.5"
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
              A clear team description helps potential members understand your
              team's goals and values.
            </p>
            <p className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#4de840] mr-2 flex-shrink-0 mt-0.5"
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
              Setting the right team size ensures you have enough players
              without overcrowding.
            </p>
            <p className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#4de840] mr-2 flex-shrink-0 mt-0.5"
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
              Keep your contact information up-to-date so members can reach you
              when needed.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Success message overlay */}
      <AnimatePresence>
        {showSuccessMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowSuccessMessage(false)}
            ></motion.div>
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#171717]/90 backdrop-blur-[10px] border border-[#4de840]/30 rounded-xl shadow-lg p-6 max-w-md w-full z-50 text-center"
            >
              <div className="w-16 h-16 bg-[#4de840]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#4de840]"
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
              </div>
              <h2 className="text-xl font-bold text-[#fffce1] mb-2">
                Team Updated Successfully!
              </h2>
              <p className="text-[#fffce1]/70 mb-4">
                Your team information has been updated. Redirecting you back to
                the team page...
              </p>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="h-1 bg-[#4de840] rounded-full"
              ></motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditTeam;
