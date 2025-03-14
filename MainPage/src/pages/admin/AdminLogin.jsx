"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const AdminLogin = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    // Simulate API call to authenticate admin
    setTimeout(() => {
      // In a real app, this would be an API call to authenticate the admin
      // For demo purposes, we'll just check against localStorage

      const admins = JSON.parse(localStorage.getItem("admins") || "[]");
      const admin = admins.find((a) => a.username === formData.username);

      if (!admin) {
        setErrors({ username: "Admin username not found" });
        setIsSubmitting(false);
        return;
      }

      if (admin.password !== formData.password) {
        setErrors({ password: "Incorrect username or password" });
        setIsSubmitting(false);
        return;
      }

      // Login successful
      const adminData = {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        userType: "admin",
      };

      // Store admin in localStorage
      localStorage.setItem("admin", JSON.stringify(adminData));

      // Update context
      setUser({
        ...adminData,
        isAdmin: true,
      });

      setIsSubmitting(false);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your admin credentials
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1"
              >
                Admin Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-600"
                } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                placeholder="Admin Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-400">{errors.username}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  } bg-[#333] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-10`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white mt-1"
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
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
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
                "Sign in as Admin"
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-300">
              Don't have an admin account?{" "}
              <Link
                to="/admin/register"
                className="font-medium text-purple-400 hover:text-purple-300"
              >
                Register as Admin
              </Link>
            </p>
            <p className="text-sm text-gray-300">
              <Link
                to="/login"
                className="font-medium text-gray-400 hover:text-gray-300"
              >
                Back to User Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
