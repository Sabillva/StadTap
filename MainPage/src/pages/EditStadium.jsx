"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { getStadiumByName } from "../utils/stadiumUtils";

const EditStadium = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    hourlyRate: 0,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is a stadium owner
    if (!user || user.userType !== "owner") {
      navigate("/");
      return;
    }

    // Find the stadium owned by this user
    const foundStadium = getStadiumByName(user.stadiumName);

    if (!foundStadium) {
      navigate("/my-stadium");
      return;
    }

    setStadium(foundStadium);
    setFormData({
      name: foundStadium.name,
      hourlyRate: foundStadium.hourlyRate,
      description: foundStadium.description || "",
    });

    setLoading(false);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For hourlyRate, ensure it's a number and not less than 1
    if (name === "hourlyRate") {
      const numValue = Number.parseFloat(value);
      if (isNaN(numValue) || numValue < 1) {
        setErrors({ ...errors, hourlyRate: "Price must be at least 1 AZN" });
        return;
      } else {
        setErrors({ ...errors, hourlyRate: null });
      }
    }

    setFormData({
      ...formData,
      [name]: name === "hourlyRate" ? Number.parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Stadium name is required";
    }

    if (!formData.hourlyRate || formData.hourlyRate < 1) {
      newErrors.hourlyRate = "Price must be at least 1 AZN";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Update stadium data
    const updatedStadium = {
      ...stadium,
      name: formData.name,
      hourlyRate: formData.hourlyRate,
      description: formData.description,
    };

    // Update in localStorage
    const storedStadiums = JSON.parse(
      localStorage.getItem("customStadiums") || "[]"
    );

    // Check if we already have a custom entry for this stadium
    const existingIndex = storedStadiums.findIndex(
      (s) => s.id === stadium.id || s.name === stadium.name
    );

    if (existingIndex >= 0) {
      storedStadiums[existingIndex] = {
        ...storedStadiums[existingIndex],
        name: formData.name,
        hourlyRate: formData.hourlyRate,
        description: formData.description,
      };
    } else {
      storedStadiums.push({
        id: `custom-${Date.now()}`,
        name: formData.name,
        hourlyRate: formData.hourlyRate,
        description: formData.description,
        originalId: stadium.id,
        originalName: stadium.name,
        city: stadium.city,
        address: stadium.address,
        image: stadium.image,
        amenities: stadium.amenities,
        features: stadium.features,
        rating: stadium.rating,
        reviews: stadium.reviews,
        ownerId: user.id,
      });
    }

    localStorage.setItem("customStadiums", JSON.stringify(storedStadiums));

    // Update user's stadium name if it changed
    if (formData.name !== user.stadiumName) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = storedUsers.map((u) => {
        if (u.id === user.id) {
          return { ...u, stadiumName: formData.name };
        }
        return u;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update current user in localStorage
      const updatedUser = { ...user, stadiumName: formData.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    setIsSubmitting(false);

    // Show success message and navigate back
    alert("Stadium details updated successfully!");
    navigate("/my-stadium");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <svg
          className="animate-spin h-10 w-10 text-green-400 mx-auto"
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
        <p className="mt-4 text-gray-300">Loading stadium details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={
              stadium.image ||
              `https://source.unsplash.com/random/800x600/?football,stadium&sig=${stadium.id}`
            }
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Stadium</h1>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Stadium Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="hourlyRate"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Hourly Rate (AZN)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={`w-full px-3 py-2 border ${
                    errors.hourlyRate ? "border-red-500" : "border-gray-600"
                  } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.hourlyRate && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/my-stadium")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStadium;
