"use client";

// import Ball from "../assets/ball.png";

import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  useEffect(() => {
    // Check if user just registered
    if (location.state?.registered) {
      setShowRegistrationSuccess(true);
    }
  }, [location.state]);

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
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to authenticate user
    setTimeout(() => {
      // In a real app, this would be an API call to authenticate the user
      // For demo purposes, we'll just check against localStorage

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.username === formData.username);

      if (!user) {
        setErrors({ username: "Username not found" });
        setIsSubmitting(false);
        return;
      }

      if (user.password !== formData.password) {
        setErrors({ password: "Incorrect username or password" });
        setIsSubmitting(false);
        return;
      }

      // Login successful
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        userType: user.userType,
        stadiumName: user.stadiumName, // Include stadiumName for stadium owners
      };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Update context
      setUser(userData);

      setIsSubmitting(false);

      // Redirect to home
      navigate("/stadiums");
    }, 1000);
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  const handleAdminRegister = () => {
    navigate("/admin/register");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0a] via-[#121712] to-[#0a0b0a]"></div>

        {/* Football field pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c643e7f3b?q=80&w=2070')] bg-cover bg-center opacity-10"></div>

        {/* Animated football */}
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
          className="absolute w-20 h-20 rounded-full"
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
          className="absolute w-16 h-16 rounded-full"
        >
          <div className="w-full h-full bg-[url('https://www.freepnglogos.com/uploads/football-png/football-png-transparent-football-images-pluspng-21.png')] bg-contain bg-center bg-no-repeat"></div>
        </motion.div>
      </div>

      {/* Admin Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-4 right-4 z-50 bg-[#171717]/80 backdrop-blur-sm p-1 rounded-full shadow-lg"
      >
        <div className="relative">
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonHover}
            onClick={() => setShowAdminDropdown(!showAdminDropdown)}
            className="px-4 py-2 bg-[#171717] border border-[#2a2a2a] text-[#fffce1] rounded-full hover:border-[#4de840]/30 transition-all duration-300 flex items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#4de840]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Admin
          </motion.button>

          <AnimatePresence>
            {showAdminDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-[#171717] border border-[#2a2a2a] rounded-xl shadow-lg z-10 overflow-hidden"
              >
                <div className="py-1">
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(77, 232, 64, 0.1)" }}
                    onClick={handleAdminLogin}
                    className="block w-full text-left px-4 py-2 text-sm text-[#fffce1] hover:text-[#4de840] transition-colors cursor-pointer"
                  >
                    Admin Login
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(77, 232, 64, 0.1)" }}
                    onClick={handleAdminRegister}
                    className="block w-full text-left px-4 py-2 text-sm text-[#fffce1] hover:text-[#4de840] transition-colors cursor-pointer"
                  >
                    Admin Register
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex w-full max-w-5xl">
        {/* Left side - Stadium Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block w-1/2 relative overflow-hidden rounded-l-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0a] via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070')] bg-cover bg-center transform hover:scale-105 transition-transform duration-5000"></div>

          {/* Overlay with football pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0a] via-[#0a0b0a]/40 to-transparent z-5"></div>

          <div className="absolute bottom-0 left-0 p-8 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-3">
                Football Stadium Booking
              </h2>
              <p className="text-white/80 max-w-xs text-lg">
                Find and reserve the best football stadiums for your games
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-8"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 bg-[#4de840]/20 backdrop-blur-sm border border-[#4de840]/30 rounded-full text-[#4de840] hover:bg-[#4de840]/30 transition-all duration-300"
                >
                  <span>Create an account</span>
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

        {/* Right side - Login Form */}
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
              Welcome Back
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-2 text-center text-[#fffce1]/70"
            >
              Sign in to continue to your account
            </motion.p>
          </div>

          <AnimatePresence>
            {showRegistrationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-xl bg-[#4de840]/10 border border-[#4de840]/20 p-4 mb-4 mt-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-[#4de840]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-[#4de840]">
                      Registration successful
                    </h3>
                    <div className="mt-2 text-sm text-[#fffce1]/70">
                      <p>
                        Your account has been created successfully. You can now
                        log in.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            variants={fadeInUp}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
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
                    placeholder="Enter your username"
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
              </div>

              <div>
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
                    placeholder="Enter your password"
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
              </div>
            </div>

            <div>
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </div>

            <div className="text-center space-y-3">
              <motion.p variants={fadeInUp} className="text-[#fffce1]/70">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#4de840] hover:text-[#4de840]/80 transition-colors"
                >
                  Sign up
                </Link>
              </motion.p>
              <motion.p variants={fadeInUp} className="text-[#fffce1]/70">
                <Link
                  to="/signup"
                  className="font-medium text-[#4de840] hover:text-[#4de840]/80 transition-colors"
                >
                  Register as a Stadium Owner
                </Link>
              </motion.p>
            </div>
          </motion.form>
          {/* <div>
            <img src={Ball} alt="ball" />
          </div> */}

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

export default Login;
