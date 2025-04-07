"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";
import { validatePhoneNumber } from "../utils/validationUtils";

const EditMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    stadiumName: "",
    city: "",
    contactPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Get match data
    const storedMatches = localStorage.getItem("matches");
    const matches = storedMatches ? JSON.parse(storedMatches) : [];
    const match = matches.find((m) => m.id === id);

    if (!match) {
      navigate("/matches");
      return;
    }

    // Check if user is the creator
    if (match.creatorId !== user.id) {
      navigate(`/matches/${id}`);
      return;
    }

    // Format date and time if they exist
    let dateString = "";
    let timeString = "";

    if (match.date) {
      const matchDate = new Date(match.date);
      dateString = matchDate.toISOString().split("T")[0];
      timeString = matchDate.toTimeString().slice(0, 5);
    }

    setFormData({
      title: match.title || "Friendly Match",
      date: dateString,
      time: timeString,
      stadiumName: match.stadiumName || "",
      city: match.city || "",
      contactPhone: match.contactPhone || "",
      notes: match.notes || "",
    });

    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [id, navigate, user.id]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!validatePhoneNumber(formData.contactPhone)) {
      newErrors.contactPhone =
        "Please enter a valid phone number format (e.g., +994 XX XXX XX XX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Combine date and time if both are provided
    let dateTime = null;
    if (formData.date && formData.time) {
      dateTime = new Date(`${formData.date}T${formData.time}`);
    }

    // Update match
    setTimeout(() => {
      const storedMatches = localStorage.getItem("matches");
      const matches = JSON.parse(storedMatches);
      const updatedMatches = matches.map((match) => {
        if (match.id === id) {
          return {
            ...match,
            title: formData.title,
            date: dateTime ? dateTime.toISOString() : undefined,
            stadiumName: formData.stadiumName || undefined,
            city: formData.city || undefined,
            contactPhone: formData.contactPhone,
            notes: formData.notes,
          };
        }
        return match;
      });

      localStorage.setItem("matches", JSON.stringify(updatedMatches));

      setIsSubmitting(false);
      setShowSuccessMessage(true);

      // Navigate after showing success message
      setTimeout(() => {
        navigate(`/matches/${id}`);
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
            Loading match details...
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
        onClick={() => navigate(`/matches/${id}`)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-24 z-30 md:left-8 md:top-28 bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-full p-3 text-[#fffce1] hover:border-[#4de840] transition-all duration-300 cursor-pointer"
        aria-label="Go back to match details"
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
                  htmlFor="title"
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
                  Match Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                      errors.title ? "border-rose-500" : "border-white/15"
                    } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                  />
                  <AnimatePresence>
                    {errors.title && (
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
                        {errors.title}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="date"
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                        errors.date ? "border-rose-500" : "border-white/15"
                      } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    />
                    <AnimatePresence>
                      {errors.date && (
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
                          {errors.date}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="time"
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                        errors.time ? "border-rose-500" : "border-white/15"
                      } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    />
                    <AnimatePresence>
                      {errors.time && (
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
                          {errors.time}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="city"
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                        errors.city ? "border-rose-500" : "border-white/15"
                      } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                      placeholder="Enter city"
                    />
                    <AnimatePresence>
                      {errors.city && (
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
                          {errors.city}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="stadiumName"
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Stadium Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="stadiumName"
                      name="stadiumName"
                      value={formData.stadiumName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                        errors.stadiumName
                          ? "border-rose-500"
                          : "border-white/15"
                      } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                      placeholder="Enter stadium name (optional)"
                    />
                    <AnimatePresence>
                      {errors.stadiumName && (
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
                          {errors.stadiumName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="contactPhone"
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
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                      errors.contactPhone
                        ? "border-rose-500"
                        : "border-white/15"
                    } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    placeholder="+994 XX XXX XX XX"
                    required
                  />
                  <AnimatePresence>
                    {errors.contactPhone && (
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
                        {errors.contactPhone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="notes"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Notes
                </label>
                <div className="relative">
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 bg-[rgb(25,25,25)] border ${
                      errors.notes ? "border-rose-500" : "border-white/15"
                    } text-[#fffce1] rounded-xl focus:outline-none focus:border-[#4de840] transition-all duration-300`}
                    placeholder="Any additional information about the match"
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-xs text-[#fffce1]/50">
                    {formData.notes.length} characters
                  </div>
                  <AnimatePresence>
                    {errors.notes && (
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
                        {errors.notes}
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
                  onClick={() => navigate(`/matches/${id}`)}
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
                      Update Match
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
              Match Management Tips
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
              A clear match title and description helps potential opponents
              understand what kind of match you're organizing.
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
              Make sure to include accurate location details so participants can
              find the venue easily.
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
              Keep your contact information up-to-date so potential opponents
              can reach you when needed.
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
                Match Updated Successfully!
              </h2>
              <p className="text-[#fffce1]/70 mb-4">
                Your match information has been updated. Redirecting you back to
                the match page...
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

export default EditMatch;
