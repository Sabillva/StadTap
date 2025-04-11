"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const inputRefs = useRef([]);

  // Valid email providers
  const validEmailProviders = [
    "gmail.com",
    "mail.ru",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "yandex.ru",
    "protonmail.com",
    "zoho.com",
    "icloud.com",
  ];

  // Check if email is from a valid provider
  const isValidEmailProvider = (email) => {
    const domain = email.split("@")[1];
    return validEmailProviders.includes(domain);
  };

  // Basic email format validation
  const hasValidEmailFormat = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Check if email is already registered
  const isEmailAlreadyRegistered = (email) => {
    // In a real app, this would be an API call to check the database
    // For demo purposes, we'll use localStorage
    const registeredEmails = JSON.parse(
      localStorage.getItem("registeredEmails") || "[]"
    );
    return registeredEmails.includes(email);
  };

  // Save email as registered
  const saveRegisteredEmail = (email) => {
    const registeredEmails = JSON.parse(
      localStorage.getItem("registeredEmails") || "[]"
    );
    registeredEmails.push(email);
    localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!hasValidEmailFormat(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (!isValidEmailProvider(formData.email)) {
      newErrors.email =
        "Please use a supported email provider (gmail.com, mail.ru, yahoo.com, etc.)";
    } else if (isEmailAlreadyRegistered(formData.email)) {
      newErrors.email = "This email is already registered";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate email verification (in a real app, this would be an API call)
    setTimeout(() => {
      // Store registration data in localStorage for step 2
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          ...formData,
          userType,
        })
      );

      setIsSubmitting(false);

      fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("OTP sent:", data);
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
        });

      setEmailSent(true);

      navigate("/signup/verify-otp");

      // In a real app, we would send an email with a verification code
      // For demo purposes, we'll just show the code
    }, 1500);
  };

  const handleCodeChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setCodeError("");

    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyEmail = async () => {
    setCodeError("");
    // Check for empty digits first
    if (verificationCode.some((digit) => digit === "")) {
      setCodeError("Please enter all 6 digits");
      return;
    }

    const enteredOtp = verificationCode.join(""); // combine 6 digits
    const email = formData.email;

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCodeError(data.message || "Verification failed");
        return;
      }

      // If verified, go to next step (use your own route here)
    } catch (error) {
      console.error("OTP verify error:", error);
      setCodeError("Something went wrong. Please try again.");
    }

    navigate("/signup/step2");
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2936')] bg-cover bg-center opacity-10"></div>

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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070')] bg-cover bg-center transform hover:scale-105 transition-transform duration-5000"></div>

          {/* Overlay with football pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0a] via-[#0a0b0a]/40 to-transparent z-5"></div>

          <div className="absolute bottom-0 left-0 p-8 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-3">
                Join Our Football Community
              </h2>
              <p className="text-white/80 max-w-xs text-lg">
                Create an account to find and book the best football stadiums in
                your area
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

        {/* Right side - Signup Form */}
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
              Create your account
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-2 text-center text-[#fffce1]/70"
            >
              Join our platform to find and reserve football stadiums
            </motion.p>
          </div>

          <AnimatePresence>
            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-[#4de840]/10 border border-[#4de840]/20 p-6 mb-6 mt-6"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#4de840]/20 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="h-8 w-8 text-[#4de840]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-[#4de840] mb-2">
                      Verification email sent
                    </h3>
                    <div className="text-[#fffce1]/70">
                      <p>
                        Please check your email to verify your account and
                        continue with registration.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Demo verification code display */}
 

                {/* Verification code input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <p className="text-[#fffce1]/70 mb-3">
                    Enter the 6-digit verification code:
                  </p>
                  <div className="flex justify-center space-x-2">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#fffce1] focus:border-[#4de840] focus:outline-none transition-all duration-200"
                      />
                    ))}
                  </div>
                  {codeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {codeError}
                    </motion.p>
                  )}
                </motion.div>

                {/* Verify button */}
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHover}
                  onClick={handleVerifyEmail}
                  disabled={verificationCode.some((digit) => digit === "")}
                  className={`w-full flex justify-center py-3 px-4 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                    verificationCode.some((digit) => digit === "")
                      ? "bg-[#2a2a2a] text-[#fffce1]/50 cursor-not-allowed"
                      : "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] hover:shadow-lg hover:shadow-[#4de840]/20"
                  }`}
                >
                  <span className="flex items-center justify-center">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Verify Email
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                variants={staggerContainer}
                className="mt-8 space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="flex justify-center space-x-4 mb-6">
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonHover}
                    type="button"
                    className={`px-5 py-2.5 rounded-full ${
                      userType === "user"
                        ? "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f]"
                        : "bg-[#1a1a1a] text-[#fffce1]/70 border border-[#2a2a2a] hover:border-[#4de840]/30"
                    } transition-all duration-300 cursor-pointer`}
                    onClick={() => setUserType("user")}
                  >
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      As Player
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonHover}
                    type="button"
                    className={`px-5 py-2.5 rounded-full ${
                      userType === "owner"
                        ? "bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f]"
                        : "bg-[#1a1a1a] text-[#fffce1]/70 border border-[#2a2a2a] hover:border-[#4de840]/30"
                    } transition-all duration-300 cursor-pointer`}
                    onClick={() => setUserType("owner")}
                  >
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      As Stadium Owner
                    </span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                    >
                      First Name
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
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-[#2a2a2a]"
                        } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:border-[#4de840]/50 transition-all duration-300`}
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.firstName && (
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
                          {errors.firstName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                    >
                      Last Name
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
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-[#2a2a2a]"
                        } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:border-[#4de840]/50 transition-all duration-300`}
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.lastName && (
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
                          {errors.lastName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#fffce1]/70 mb-2"
                    >
                      Email
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={`w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border ${
                          errors.email ? "border-red-500" : "border-[#2a2a2a]"
                        } rounded-xl text-[#fffce1] placeholder-[#fffce1]/30 focus:outline-none focus:border-[#4de840]/50 transition-all duration-300`}
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
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
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Verify Email
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
            )}
          </AnimatePresence>

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

export default SignUp;
