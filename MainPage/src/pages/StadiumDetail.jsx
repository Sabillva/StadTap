"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import stadiumsData from "../utils/stadiumsData";
import { incrementStadiumViews } from "../utils/stadiumUtils";
import { getStadiumById } from "../utils/stadiumUtils";

const StadiumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add a new state for stadium posts
  const [stadiumPosts, setStadiumPosts] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    try {
      // Find the stadium with the matching ID using our utility function
      // This will include any custom updates to the stadium
      const foundStadium = getStadiumById(id);

      if (!foundStadium) {
        navigate("/stadiums");
        return;
      }

      // Increment view count every time the stadium detail page is viewed
      const viewCount = incrementStadiumViews(id);

      // Update stadium with dynamic data
      setStadium({
        ...foundStadium,
        reviews: viewCount,
      });

      // Load posts for this stadium
      const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]");
      const stadiumPosts = allPosts.filter((post) => post.stadiumId === id);
      setStadiumPosts(stadiumPosts);
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

  // Add these functions for the gallery
  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setShowGalleryModal(true);
  };

  const navigateGallery = (direction) => {
    let newIndex = selectedImageIndex + direction;
    if (newIndex < 0) newIndex = stadiumPosts.length - 1;
    if (newIndex >= stadiumPosts.length) newIndex = 0;
    setSelectedImageIndex(newIndex);
  };

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
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Stadium Gallery
              </h2>
              {stadiumPosts.length > 0 && (
                <button
                  onClick={() => openGallery(0)}
                  className="text-green-400 hover:text-green-300 flex items-center text-sm"
                >
                  View all photos
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              )}
            </div>

            {stadiumPosts.length === 0 ? (
              <div className="bg-[#333] p-6 rounded-lg text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-500 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-400">
                  No gallery photos available for this stadium yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {stadiumPosts.slice(0, 8).map((post, index) => (
                  <div
                    key={post.id}
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer relative group"
                    onClick={() => openGallery(index)}
                  >
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt="Stadium gallery"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      {post.caption && (
                        <p className="text-white text-sm p-2 line-clamp-2">
                          {post.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {stadiumPosts.length > 8 && (
                  <div
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer bg-[#333] flex items-center justify-center hover:bg-[#444] transition-colors duration-300"
                    onClick={() => openGallery(8)}
                  >
                    <div className="text-white text-center">
                      <span className="text-2xl font-bold">
                        +{stadiumPosts.length - 8}
                      </span>
                      <p className="text-sm">more photos</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gallery Modal */}
          {showGalleryModal && stadiumPosts.length > 0 && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
              <button
                onClick={() => setShowGalleryModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black/30 rounded-full transition-colors"
                aria-label="Close gallery"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigateGallery(-1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2 bg-black/30 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="max-w-5xl max-h-[90vh] p-4">
                <img
                  src={
                    stadiumPosts[selectedImageIndex].imageUrl ||
                    "/placeholder.svg"
                  }
                  alt="Stadium gallery"
                  className="max-w-full max-h-[75vh] object-contain mx-auto rounded-lg shadow-2xl"
                />
                <div className="mt-4 bg-black/50 p-3 rounded-lg">
                  {stadiumPosts[selectedImageIndex].caption ? (
                    <p className="text-white text-center">
                      {stadiumPosts[selectedImageIndex].caption}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-center italic">
                      No caption
                    </p>
                  )}
                  <div className="mt-2 text-center text-gray-400 flex items-center justify-center">
                    <span className="px-2 py-1 bg-black/50 rounded-full text-xs">
                      {selectedImageIndex + 1} / {stadiumPosts.length}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateGallery(1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2 bg-black/30 rounded-full transition-colors"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

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
