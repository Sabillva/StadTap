"use client";

import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your credentials to access the platform
          </p>
        </div>

        {showRegistrationSuccess && (
          <div className="rounded-md bg-green-500/20 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
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
                <h3 className="text-sm font-medium text-green-400">
                  Registration successful
                </h3>
                <div className="mt-2 text-sm text-green-300">
                  <p>
                    Your account has been created successfully. You can now log
                    in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-600"
                } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-400">{errors.username}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-green-400 hover:text-green-300"
              >
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-300">
              <Link
                to="/signup"
                className="font-medium text-green-400 hover:text-green-300"
              >
                Register as a Stadium Owner
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
