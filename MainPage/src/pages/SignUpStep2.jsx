"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import stadiumsData from "../utils/stadiumsData";

const SignUpStep2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    username: "",
    password: "",
    stadiumName: "", // Added stadium name field
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Get registration data from step 1
    const registrationData = localStorage.getItem("registrationData");
    if (!registrationData) {
      // If no data, redirect to step 1
      navigate("/signup");
      return;
    }

    const data = JSON.parse(registrationData);
    setFormData({
      ...formData,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      userType: data.userType,
    });

    // Load stadiums for dropdown
    setStadiums(stadiumsData.map((stadium) => stadium.name));
  }, [navigate]);

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number";
    }

    // Validate stadium name if user is an owner
    if (formData.userType === "owner" && !formData.stadiumName.trim()) {
      newErrors.stadiumName = "Stadium name is required for stadium owners";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to check if username exists
    setTimeout(() => {
      // In a real app, this would be an API call to create the user
      // For demo purposes, we'll just store the user in localStorage

      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if username already exists
      const usernameExists = users.some(
        (user) => user.username === formData.username
      );
      if (usernameExists) {
        setErrors({ username: "This username is already taken" });
        setIsSubmitting(false);
        return;
      }

      // Check if stadium is already owned
      if (formData.userType === "owner") {
        const stadiumExists = users.some(
          (user) =>
            user.userType === "owner" &&
            user.stadiumName === formData.stadiumName
        );
        if (stadiumExists) {
          setErrors({ stadiumName: "This stadium already has an owner" });
          setIsSubmitting(false);
          return;
        }
      }

      // Add new user
      users.push({
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password, // In a real app, this would be hashed
        userType: formData.userType,
        stadiumName:
          formData.userType === "owner" ? formData.stadiumName : null, // Save stadium name for owners
      });

      localStorage.setItem("users", JSON.stringify(users));

      // Clear registration data
      localStorage.removeItem("registrationData");

      setIsSubmitting(false);

      // Redirect to login
      navigate("/login", { state: { registered: true } });
    }, 1500);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0a] via-[#121712] to-[#0a0b0a]"></div>

        {/* Football field pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070')] bg-cover bg-center opacity-10"></div>

        {/* Animated footballs */}
        <motion.div
          initial={{ x: -100, y: -100, opacity: 0, rotate: 0 }}
          animate={{
            x: ["-10vw", "110vw"],
            y: ["10vh", "30vh"],
            opacity: [0, 0.2, 0.2, 0],
            rotate: 360,
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            times: [0, 0.1, 0.9, 1],
            rotate: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
          className="absolute w-16 h-16 rounded-full"
        >
          <div className="w-full h-full bg-[url('https://www.freepnglogos.com/uploads/football-png/football-png-transparent-football-images-pluspng-21.png')] bg-contain bg-center bg-no-repeat"></div>
        </motion.div>

        <motion.div
          initial={{ x: "110vw", y: "70vh", opacity: 0, rotate: 0 }}
          animate={{
            x: ["110vw", "-10vw"],
            y: ["70vh", "40vh"],
            opacity: [0, 0.15, 0.15, 0],
            rotate: -360,
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            times: [0, 0.1, 0.9, 1],
            rotate: {
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
          className="absolute w-12 h-12 rounded-full"
        >
          <div className="w-full h-full bg-[url('https://www.freepnglogos.com/uploads/football-png/football-png-transparent-football-images-pluspng-21.png')] bg-contain bg-center bg-no-repeat"></div>
        </motion.div>
      </div>

      <div className="flex w-full max-w-5xl">
        {/* Left side - Stadium Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block w-1/2 relative overflow-hidden rounded-l-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0a] via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=2070')] bg-cover bg-center transform hover:scale-105 transition-transform duration-5000"></div>

          {/* Overlay with football pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0a] via-[#0a0b0a]/40 to-transparent z-5"></div>

          <div className="absolute bottom-0 left-0 p-8 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-3">
                Complete Your Profile
              </h2>
              <p className="text-white/80 max-w-xs text-lg">
                You're almost there! Set up your account details to start
                booking stadiums
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-8"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-[#4de840]/20 backdrop-blur-sm border border-[#4de840]/30 rounded-full text-[#4de840] hover:bg-[#4de840]/30 transition-all duration-300"
                >
                  <span>Already have an account?</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
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
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full lg:w-1/2 bg-[#171717]/90 backdrop-blur-md border border-[#2a2a2a] rounded-3xl lg:rounded-l-none lg:rounded-r-3xl p-8 shadow-xl relative z-10"
        >
          <div>
            <motion.h2
              variants={fadeInUp}
              className="mt-6 text-center text-3xl font-bold text-[#fffce1]"
            >
              Complete your registration
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-2 text-center text-[#fffce1]/70"
            >
              Step 2 of 2: Create your username and password
            </motion.p>
          </div>

          <motion.form
            variants={staggerContainer}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    disabled
                    className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#1a1a1a]/50 text-[#fffce1]/70 rounded-xl"
                    value={formData.firstName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    disabled
                    className="w-full px-4 py-3 border border-[#2a2a2a] bg-[#1a1a1a]/50 text-[#fffce1]/70 rounded-xl"
                    value={formData.lastName}
                  />
                </div>
              </motion.div>

              {/* Stadium Name field for stadium owners */}
              {formData.userType === "owner" && (
                <motion.div variants={fadeInUp}>
                  <label
                    htmlFor="stadiumName"
                    className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                  >
                    Stadium Name <span className="text-[#4de840]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <select
                      id="stadiumName"
                      name="stadiumName"
                      value={formData.stadiumName}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border ${
                        errors.stadiumName
                          ? "border-red-500"
                          : "border-[#2a2a2a]"
                      } rounded-xl text-[#fffce1] focus:outline-none focus:border-[#4de840]/50 transition-all duration-300 appearance-none`}
                    >
                      <option value="" className="bg-[#1a1a1a]">
                        Select your stadium
                      </option>
                      {stadiums.map((stadium, index) => (
                        <option
                          key={index}
                          value={stadium}
                          className="bg-[#1a1a1a]"
                        >
                          {stadium}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4de840] pointer-events-none">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors.stadiumName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-400 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.stadiumName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              <motion.div variants={fadeInUp}>
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
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border ${
                      errors.username ? "border-red-500" : "border-[#2a2a2a]"
                    } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:border-[#4de840]/50 transition-all duration-300`}
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <AnimatePresence>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-400 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.username}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4de840]">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border ${
                      errors.password ? "border-red-500" : "border-[#2a2a2a]"
                    } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:border-[#4de840]/50 transition-all duration-300`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#fffce1]/50 hover:text-[#4de840] transition-colors"
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
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-400 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="mt-2 text-xs text-[#fffce1]/50">
                  Password must be at least 8 characters with at least one
                  uppercase letter, one lowercase letter, and one number.
                </p>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp}>
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonHover}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0e100f]"
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
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
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
                    Complete Sign Up
                  </span>
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-[#fffce1]/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#4de840] hover:text-[#4de840]/80 transition-colors"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          </motion.form>

          {/* Football decoration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute -bottom-10 -right-10 w-40 h-40 bg-[url('https://www.freepnglogos.com/uploads/football-png/football-png-transparent-football-images-pluspng-21.png')] bg-contain bg-center bg-no-repeat opacity-10"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpStep2;
