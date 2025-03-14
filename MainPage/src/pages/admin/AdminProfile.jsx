"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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

    setLoading(false);
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
      alert("Profile updated successfully");
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
      <div className="min-h-screen bg-[#222] flex items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-purple-500"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    errors.firstName ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                    errors.lastName ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
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
                  errors.email ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
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
                  errors.username ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            <div className="border-t border-gray-700 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Change Password
              </h2>

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
                        : "border-gray-600"
                    } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10`}
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
                      errors.newPassword ? "border-red-500" : "border-gray-600"
                    } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                        : "border-gray-600"
                    } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Delete Account
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your admin account? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
