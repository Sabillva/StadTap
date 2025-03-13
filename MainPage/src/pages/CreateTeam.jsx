"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { validatePhoneNumber } from "../utils/validationUtils";

const CreateTeam = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: `${user.firstName}'s Team`,
    description: "",
    maxMembers: 5,
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number format (e.g., +994 XX XXX XX XX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Create new team
    const newTeam = {
      id: Date.now().toString(),
      name: formData.name,
      creatorId: user.id,
      creatorName: `${user.firstName} ${user.lastName}`,
      description: formData.description,
      memberCount: 0, // Changed from 1 to 0 since creator doesn't count as a member
      maxMembers: Number.parseInt(formData.maxMembers),
      phoneNumber: formData.phoneNumber,
      createdAt: new Date().toISOString(),
      members: [], // Creator is not added as a member
      joinRequests: [],
    };

    // Save to localStorage
    setTimeout(() => {
      const storedTeams = localStorage.getItem("teams");
      const teams = storedTeams ? JSON.parse(storedTeams) : [];

      teams.push(newTeam);
      localStorage.setItem("teams", JSON.stringify(teams));

      setIsSubmitting(false);
      navigate(`/teams/${newTeam.id}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          Create a New Team
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-1"
              >
                Team Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-1"
              >
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-3 py-2 border ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Describe your team, what kind of players you're looking for, etc."
                required
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="maxMembers"
                className="block text-sm font-medium text-white mb-1"
              >
                Maximum Members (1-10)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (formData.maxMembers > 1) {
                      setFormData({
                        ...formData,
                        maxMembers: formData.maxMembers - 1,
                      });
                    }
                  }}
                  className="px-3 py-2 bg-[#444] text-white rounded-l-md hover:bg-[#555]"
                >
                  -
                </button>
                <input
                  type="number"
                  id="maxMembers"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-16 px-3 py-2 border-y border-gray-600 bg-[#333] text-white text-center focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.maxMembers < 10) {
                      setFormData({
                        ...formData,
                        maxMembers: formData.maxMembers + 1,
                      });
                    }
                  }}
                  className="px-3 py-2 bg-[#444] text-white rounded-r-md hover:bg-[#555]"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-white mb-1"
              >
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-600"
                } bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="+994 XX XXX XX XX"
                required
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate("/teams")}
                className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
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
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
