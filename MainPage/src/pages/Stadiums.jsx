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

  // Get current stadiums for pagination
  const indexOfLastStadium = currentPage * stadiumsPerPage;
  const indexOfFirstStadium = indexOfLastStadium - stadiumsPerPage;
  const currentStadiums = filteredStadiums.slice(
    indexOfFirstStadium,
    indexOfLastStadium
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Math.random()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Football Stadiums
      </h1>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stadiums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-[#333] border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full px-4 py-2 bg-[#333] border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
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
                className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden hover:border-green-500 transition-colors"
              >
                <div className="relative h-48">
                  <img
                    src={
                      stadium.image ||
                      `https://source.unsplash.com/random/800x600/?football,stadium&sig=${stadium.id}`
                    }
                    alt={stadium.name}
                    className="w-full h-full object-cover"
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
                    <div className="text-green-400 font-semibold">
                      {stadium.hourlyRate} AZN/hour
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
