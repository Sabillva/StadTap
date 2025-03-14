"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import stadiumsData from "../utils/stadiumsData";
import {
  incrementStadiumViews,
  calculateStadiumRating,
} from "../utils/stadiumUtils";

const StadiumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Find the stadium with the matching ID
      const foundStadium = stadiumsData.find((s) => s.id === id);

      if (!foundStadium) {
        navigate("/stadiums");
        return;
      }

      // Get current view counts from localStorage to check if we need to increment
      const viewCountsStr = localStorage.getItem("stadiumViewCounts");
      const viewCounts = viewCountsStr ? JSON.parse(viewCountsStr) : {};
      const currentCount = viewCounts[id] || 0;

      // Increment view count every time the stadium detail page is viewed
      const viewCount = incrementStadiumViews(id);

      // Calculate dynamic rating based on paid reservations
      const dynamicRating = calculateStadiumRating(id);

      // Update stadium with dynamic data
      setStadium({
        ...foundStadium,
        reviews: viewCount,
        rating: dynamicRating || foundStadium.rating,
      });
    } catch (error) {
      console.error("Error loading stadium details:", error);
      // Fallback to original data if there's an error
      const foundStadium = stadiumsData.find((s) => s.id === id);
      if (foundStadium) {
        setStadium(foundStadium);
      } else {
        navigate("/stadiums");
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Math.random()}`;
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
      <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={
              stadium.image ||
              `https://source.unsplash.com/random/800x600/?football,stadium&sig=${stadium.id}`
            }
            alt={stadium.name}
            className="w-full h-64 md:h-80 object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {stadium.name}
            </h1>
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-400 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-white">{stadium.city}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white">
                  {stadium.rating} ({stadium.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-400 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-white font-semibold">
                  {stadium.hourlyRate} AZN/hour
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Description
            </h2>
            <p className="text-gray-300">{stadium.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Address</h2>
            <p className="text-gray-300">{stadium.address}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Amenities</h2>
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

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Features</h2>
            <div className="flex flex-wrap gap-2">
              {stadium.features &&
                stadium.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#333] text-gray-300 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Back
            </button>
            <Link
              to={`/reserve/${stadium.id}`}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Reserve Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StadiumDetail;
