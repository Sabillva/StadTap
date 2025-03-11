"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: 5,
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use localStorage
    const storedTeams = localStorage.getItem("teams");
    const teams = storedTeams ? JSON.parse(storedTeams) : [];
    const team = teams.find((t) => t.id === id);

    if (!team) {
      navigate("/teams");
      return;
    }

    // Check if user is the creator
    if (team.creatorId !== user.id) {
      navigate(`/teams/${id}`);
      return;
    }

    setFormData({
      name: team.name,
      description: team.description,
      maxMembers: team.maxMembers,
      phoneNumber: team.phoneNumber,
    });

    setLoading(false);
  }, [id, navigate, user.id]);

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Update team
    setTimeout(() => {
      const storedTeams = localStorage.getItem("teams");
      const teams = JSON.parse(storedTeams);
      const updatedTeams = teams.map((team) => {
        if (team.id === id) {
          return {
            ...team,
            name: formData.name,
            description: formData.description,
            maxMembers: Number.parseInt(formData.maxMembers),
            phoneNumber: formData.phoneNumber,
          };
        }
        return team;
      });

      localStorage.setItem("teams", JSON.stringify(updatedTeams));

      setIsSubmitting(false);
      navigate(`/teams/${id}`);
    }, 1000);
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
        <p className="mt-4 text-gray-300">Loading team details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Team</h1>

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
                onClick={() => navigate(`/teams/${id}`)}
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
                    Updating...
                  </>
                ) : (
                  "Update Team"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
