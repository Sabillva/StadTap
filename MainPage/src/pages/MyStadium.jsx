"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import stadiumsData from "../utils/stadiumsData";

const MyStadium = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hourlyRate: 0,
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if user is a stadium owner
    if (!user || user.userType !== "owner") {
      navigate("/");
      return;
    }

    // Find the stadium owned by this user
    const foundStadium = stadiumsData.find((s) => s.name === user.stadiumName);

    if (!foundStadium) {
      // If stadium not found, check if we need to create one
      const storedStadiums = JSON.parse(
        localStorage.getItem("customStadiums") || "[]"
      );
      const customStadium = storedStadiums.find(
        (s) => s.name === user.stadiumName
      );

      if (customStadium) {
        setStadium(customStadium);
        setFormData({
          name: customStadium.name,
          hourlyRate: customStadium.hourlyRate,
          description: customStadium.description || "",
        });
      } else {
        // Create a new stadium entry for this owner
        const newStadium = {
          id: `custom-${Date.now()}`,
          name: user.stadiumName,
          city: "Unknown",
          address: "Unknown",
          description: "No description available",
          hourlyRate: 100,
          image: `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Date.now()}`,
          amenities: {
            recording: false,
            buffet: false,
            parking: true,
            shower: true,
            lockerRoom: true,
          },
          features: ["Basic Facilities"],
          rating: 4.0,
          reviews: 0,
          ownerId: user.id,
        };

        // Save to localStorage
        storedStadiums.push(newStadium);
        localStorage.setItem("customStadiums", JSON.stringify(storedStadiums));

        setStadium(newStadium);
        setFormData({
          name: newStadium.name,
          hourlyRate: newStadium.hourlyRate,
          description: newStadium.description,
        });
      }
    } else {
      setStadium(foundStadium);
      setFormData({
        name: foundStadium.name,
        hourlyRate: foundStadium.hourlyRate,
        description: foundStadium.description,
      });
    }

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

    // Update stadium data
    const updatedStadium = {
      ...stadium,
      name: formData.name,
      hourlyRate: formData.hourlyRate,
      description: formData.description,
    };

    // Update in localStorage
    if (stadium.id.startsWith("custom-")) {
      // Update custom stadium
      const storedStadiums = JSON.parse(
        localStorage.getItem("customStadiums") || "[]"
      );
      const updatedStadiums = storedStadiums.map((s) =>
        s.id === stadium.id ? updatedStadium : s
      );
      localStorage.setItem("customStadiums", JSON.stringify(updatedStadiums));
    } else {
      // Update stadiumsData
      // Note: In a real app, this would be an API call
      // For demo purposes, we'll create a custom stadium entry
      const storedStadiums = JSON.parse(
        localStorage.getItem("customStadiums") || "[]"
      );

      // Check if we already have a custom entry for this stadium
      const existingIndex = storedStadiums.findIndex(
        (s) => s.id === stadium.id
      );

      if (existingIndex >= 0) {
        storedStadiums[existingIndex] = updatedStadium;
      } else {
        storedStadiums.push(updatedStadium);
      }

      localStorage.setItem("customStadiums", JSON.stringify(storedStadiums));
    }

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

      // Update current user in localStorage and context
      const updatedUser = { ...user, stadiumName: formData.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Note: In a real app, you would update the AuthContext here
      // For demo purposes, we'll just reload the page
      window.location.reload();
    }

    setStadium(updatedStadium);
    setIsEditing(false);

    // Show success message
    alert("Stadium details updated successfully!");
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
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEditing ? "Edit Stadium" : "My Stadium"}
            </h1>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
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
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#333] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">
                    Stadium Name:
                  </div>
                  <div className="font-medium text-white">{stadium.name}</div>
                </div>
                <div className="bg-[#333] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Hourly Rate:</div>
                  <div className="font-medium text-white">
                    {stadium.hourlyRate} AZN
                  </div>
                </div>
                <div className="bg-[#333] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">City:</div>
                  <div className="font-medium text-white">{stadium.city}</div>
                </div>
                <div className="bg-[#333] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Rating:</div>
                  <div className="font-medium text-white flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {stadium.rating} ({stadium.reviews} reviews)
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Description
                </h2>
                <div className="bg-[#333] p-4 rounded-lg">
                  <p className="text-gray-300">{stadium.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Amenities
                </h2>
                <div className="bg-[#333] p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    {stadium.amenities &&
                      Object.entries(stadium.amenities).map(
                        ([key, value]) =>
                          value && (
                            <div key={key} className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-400 mr-2"
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
                              <span className="text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  Edit Stadium
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStadium;
