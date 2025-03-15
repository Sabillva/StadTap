"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import stadiumsData from "../utils/stadiumsData";
import { getUpdatedStadiumData } from "../utils/stadiumUtils";

const Stadiums = () => {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const stadiumsPerPage = 8;

  // Add sorting states
  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    try {
      // Get updated stadium data with dynamic ratings and reviews
      const updatedStadiums = getUpdatedStadiumData();
      setStadiums(updatedStadiums);
    } catch (error) {
      console.error("Error loading stadium data:", error);
      // Fallback to original data if there's an error
      setStadiums(stadiumsData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unique cities for filter
  const cities = [...new Set(stadiumsData.map((stadium) => stadium.city))];

  // Filter stadiums based on search term and selected city
  const filteredStadiums = stadiums.filter((stadium) => {
    const matchesSearch = stadium.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity ? stadium.city === selectedCity : true;
    return matchesSearch && matchesCity;
  });

  // Sort stadiums based on selected criteria
  const sortedStadiums = [...filteredStadiums].sort((a, b) => {
    if (sortBy === "rating") {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    } else if (sortBy === "reviews") {
      return sortOrder === "desc"
        ? b.reviews - a.reviews
        : a.reviews - b.reviews;
    } else if (sortBy === "price") {
      return sortOrder === "desc"
        ? b.hourlyRate - a.hourlyRate
        : a.hourlyRate - b.hourlyRate;
    }
    return 0;
  });

  // Get current stadiums for pagination
  const indexOfLastStadium = currentPage * stadiumsPerPage;
  const indexOfFirstStadium = indexOfLastStadium - stadiumsPerPage;
  const currentStadiums = sortedStadiums.slice(
    indexOfFirstStadium,
    indexOfLastStadium
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Math.random()}`;
  };

  // Handle sort change
  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      // Toggle sort order if clicking the same criteria
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      // Set new criteria and default to descending
      setSortBy(criteria);
      setSortOrder("desc");
    }
    setShowSortOptions(false);
  };

  // Get sort button text
  const getSortButtonText = () => {
    if (sortBy === "none") return "Sort By";

    const criteriaText =
      sortBy === "rating"
        ? "Rating"
        : sortBy === "reviews"
        ? "Reviews"
        : "Price";

    const orderText = sortOrder === "desc" ? "High to Low" : "Low to High";

    return `${criteriaText}: ${orderText}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Football Stadiums
      </h1>

      <div className="mb-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stadiums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-[#333] border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="w-full md:w-auto px-4 py-3 bg-[#333] border border-gray-600 rounded-xl text-white hover:bg-[#444] transition-colors flex items-center justify-between"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                {getSortButtonText()}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-2 transition-transform duration-200 ${
                  showSortOptions ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-64 bg-[#333] border border-gray-700 rounded-xl shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={() => handleSortChange("rating")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                      sortBy === "rating"
                        ? "bg-green-500/20 text-green-400"
                        : "text-white hover:bg-[#444]"
                    }`}
                  >
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      Rating
                    </span>
                    {sortBy === "rating" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          sortOrder === "desc" ? "" : "rotate-180"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => handleSortChange("reviews")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                      sortBy === "reviews"
                        ? "bg-green-500/20 text-green-400"
                        : "text-white hover:bg-[#444]"
                    }`}
                  >
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                      Reviews
                    </span>
                    {sortBy === "reviews" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          sortOrder === "desc" ? "" : "rotate-180"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => handleSortChange("price")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                      sortBy === "price"
                        ? "bg-green-500/20 text-green-400"
                        : "text-white hover:bg-[#444]"
                    }`}
                  >
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
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
                      Price
                    </span>
                    {sortBy === "price" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          sortOrder === "desc" ? "" : "rotate-180"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {sortBy !== "none" && (
                    <button
                      onClick={() => {
                        setSortBy("none");
                        setShowSortOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#444] hover:text-white rounded-lg mt-1 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
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
                      Clear Sorting
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {(selectedCity || sortBy !== "none") && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCity && (
              <div className="bg-[#333] text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span>City: {selectedCity}</span>
                <button
                  onClick={() => setSelectedCity("")}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {sortBy !== "none" && (
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                <span>
                  Sort:{" "}
                  {sortBy === "rating"
                    ? "Rating"
                    : sortBy === "reviews"
                    ? "Reviews"
                    : "Price"}{" "}
                  ({sortOrder === "desc" ? "High to Low" : "Low to High"})
                </span>
                <button
                  onClick={() => setSortBy("none")}
                  className="ml-2 text-green-400 hover:text-green-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
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
          <p className="mt-4 text-gray-300">Loading stadiums...</p>
        </div>
      ) : filteredStadiums.length === 0 ? (
        <div className="text-center py-8 bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-2 text-white">
            No stadiums found
          </h2>
          <p className="text-gray-300">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentStadiums.map((stadium) => (
              <div
                key={stadium.id}
                className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      stadium.image ||
                      `https://source.unsplash.com/random/800x600/?football,stadium&sig=${stadium.id}`
                    }
                    alt={stadium.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h2 className="text-xl font-bold text-white">
                      {stadium.name}
                    </h2>
                    <div className="flex items-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-400 mr-1"
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
                      {stadium.city}
                    </div>
                  </div>

                  {/* Price badge */}
                  <div className="absolute top-0 right-0 m-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {stadium.hourlyRate} AZN/h
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-400 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white">
                        {stadium.rating}{" "}
                        <span className="text-gray-400">
                          ({stadium.reviews})
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stadium.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#333] text-gray-300 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {stadium.features.length > 3 && (
                      <span className="px-2 py-1 bg-[#333] text-gray-300 rounded-full text-xs">
                        +{stadium.features.length - 3} more
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/stadiums/${stadium.id}`}
                    className="block w-full text-center bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredStadiums.length > stadiumsPerPage && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border border-gray-600 ${
                    currentPage === 1
                      ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Previous
                </button>

                {Array.from({
                  length: Math.ceil(filteredStadiums.length / stadiumsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 border-t border-b border-gray-600 ${
                      currentPage === index + 1
                        ? "bg-green-500 text-white"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    paginate(
                      currentPage <
                        Math.ceil(filteredStadiums.length / stadiumsPerPage)
                        ? currentPage + 1
                        : currentPage
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredStadiums.length / stadiumsPerPage)
                  }
                  className={`px-3 py-1 rounded-r-md border border-gray-600 ${
                    currentPage ===
                    Math.ceil(filteredStadiums.length / stadiumsPerPage)
                      ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Stadiums;
