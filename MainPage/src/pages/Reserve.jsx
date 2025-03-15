"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import stadiumsData from "../utils/stadiumsData";
import { getUpdatedStadiumData } from "../utils/stadiumUtils";

const Reserve = () => {
  const [filters, setFilters] = useState({
    city: "",
    date: "",
    amenities: {
      recording: false,
      buffet: false,
      parking: false,
      shower: false,
      lockerRoom: false,
    },
  });

  const [stadiums, setStadiums] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const stadiumsPerPage = 4;

  // Add sorting states
  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const cities = ["Bakı", "Sumqayıt", "Gəncə"];

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

  // Sort stadiums based on selected criteria
  const sortStadiums = (stadiumsToSort) => {
    return [...stadiumsToSort].sort((a, b) => {
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
  };

  const handleDateChange = (e) => {
    setFilters({ ...filters, date: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: !filters.amenities[amenity],
      },
    });
  };

  const handleSearch = () => {
    if (!filters.city || !filters.date) {
      alert("Please select both city and date");
      return;
    }

    // Filter stadiums based on selected criteria
    let results = stadiums.filter((stadium) => stadium.city === filters.city);

    // Apply amenity filters if any are selected
    const hasAmenityFilters = Object.values(filters.amenities).some(
      (value) => value
    );

    if (hasAmenityFilters) {
      results = results.filter((stadium) => {
        return Object.entries(filters.amenities).every(([key, value]) => {
          // Only filter if the amenity is selected (true)
          return !value || stadium.amenities[key];
        });
      });
    }

    // Apply sorting if selected
    if (sortBy !== "none") {
      results = sortStadiums(results);
    }

    setFilteredStadiums(results);
    setSearched(true);
    setCurrentPage(1);
  };

  const handleClearDate = () => {
    setFilters({ ...filters, date: "" });
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setFilters({ ...filters, date: today });
  };

  const handleSetTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFilters({ ...filters, date: tomorrow.toISOString().split("T")[0] });
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

    // Re-sort if already searched
    if (searched) {
      const sortedStadiums = sortStadiums(filteredStadiums);
      setFilteredStadiums(sortedStadiums);
    }
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

  // Get current stadiums for pagination
  const indexOfLastStadium = currentPage * stadiumsPerPage;
  const indexOfFirstStadium = (currentPage - 1) * stadiumsPerPage;
  const currentStadiums = filteredStadiums.slice(
    indexOfFirstStadium,
    indexOfLastStadium
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Disable past dates in date picker
  const today = new Date().toISOString().split("T")[0];

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Math.random()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Reserve a Stadium
      </h1>

      <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-white mb-2"
            >
              Select City
            </label>
            <select
              id="city"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-4 py-3 border border-gray-600 bg-[#333] text-white rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-white mb-2"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={filters.date}
              onChange={handleDateChange}
              min={today}
              className="w-full px-4 py-3 border border-gray-600 bg-[#333] text-white rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                onClick={handleSetToday}
                className="text-xs px-3 py-1 bg-[#444] text-gray-300 rounded-full hover:bg-[#555] transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleSetTomorrow}
                className="text-xs px-3 py-1 bg-[#444] text-gray-300 rounded-full hover:bg-[#555] transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={handleClearDate}
                className="text-xs px-3 py-1 bg-[#444] text-gray-300 rounded-full hover:bg-[#555] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-white mb-2">
              Sort By
            </label>
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-xl text-white hover:bg-[#444] transition-colors flex items-center justify-between"
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
              <div className="absolute left-0 right-0 mt-2 bg-[#333] border border-gray-700 rounded-xl shadow-lg z-10">
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
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <label className="flex items-center bg-[#333] p-3 rounded-xl cursor-pointer hover:bg-[#3a3a3a] transition-colors">
              <input
                type="checkbox"
                checked={filters.amenities.recording}
                onChange={() => handleAmenityChange("recording")}
                className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333] mr-2"
              />
              <span className="text-sm text-gray-300">Recording</span>
            </label>

            <label className="flex items-center bg-[#333] p-3 rounded-xl cursor-pointer hover:bg-[#3a3a3a] transition-colors">
              <input
                type="checkbox"
                checked={filters.amenities.buffet}
                onChange={() => handleAmenityChange("buffet")}
                className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333] mr-2"
              />
              <span className="text-sm text-gray-300">Buffet</span>
            </label>

            <label className="flex items-center bg-[#333] p-3 rounded-xl cursor-pointer hover:bg-[#3a3a3a] transition-colors">
              <input
                type="checkbox"
                checked={filters.amenities.parking}
                onChange={() => handleAmenityChange("parking")}
                className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333] mr-2"
              />
              <span className="text-sm text-gray-300">Parking</span>
            </label>

            <label className="flex items-center bg-[#333] p-3 rounded-xl cursor-pointer hover:bg-[#3a3a3a] transition-colors">
              <input
                type="checkbox"
                checked={filters.amenities.shower}
                onChange={() => handleAmenityChange("shower")}
                className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333] mr-2"
              />
              <span className="text-sm text-gray-300">Shower</span>
            </label>

            <label className="flex items-center bg-[#333] p-3 rounded-xl cursor-pointer hover:bg-[#3a3a3a] transition-colors">
              <input
                type="checkbox"
                checked={filters.amenities.lockerRoom}
                onChange={() => handleAmenityChange("lockerRoom")}
                className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333] mr-2"
              />
              <span className="text-sm text-gray-300">Locker Room</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Stadiums
          </button>
        </div>

        {/* Active filters display */}
        {(filters.city ||
          filters.date ||
          Object.values(filters.amenities).some((v) => v) ||
          sortBy !== "none") &&
          searched && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mr-2">Active filters:</div>

              {filters.city && (
                <div className="bg-[#333] text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <span>City: {filters.city}</span>
                </div>
              )}

              {filters.date && (
                <div className="bg-[#333] text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <span>Date: {filters.date}</span>
                </div>
              )}

              {Object.entries(filters.amenities).map(
                ([key, value]) =>
                  value && (
                    <div
                      key={key}
                      className="bg-[#333] text-white px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    </div>
                  )
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
                </div>
              )}
            </div>
          )}
      </div>

      {searched && (
        <>
          {filteredStadiums.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Available Stadiums for {filters.date} in {filters.city}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentStadiums.map((stadium) => (
                  <div
                    key={stadium.id}
                    className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="relative md:w-2/5">
                        <img
                          src={
                            stadium.image ||
                            `https://source.unsplash.com/random/800x600/?football,stadium&sig=${
                              stadium.id || "/placeholder.svg"
                            }`
                          }
                          alt={stadium.name}
                          className="w-full h-48 md:h-full object-cover"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute top-0 left-0 m-3">
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {stadium.hourlyRate} AZN/h
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 p-3 md:hidden">
                          <h2 className="text-xl font-bold text-white">
                            {stadium.name}
                          </h2>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 flex flex-col justify-between md:w-3/5">
                        <div>
                          <h2 className="text-xl font-bold text-white hidden md:block mb-2">
                            {stadium.name}
                          </h2>
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
                            <span className="text-gray-300">
                              {stadium.city}
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-yellow-400 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white">
                              {stadium.rating}{" "}
                              <span className="text-gray-400">
                                ({stadium.reviews} reviews)
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {stadium.features
                              .slice(0, 2)
                              .map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-[#333] text-gray-300 rounded-full text-xs"
                                >
                                  {feature}
                                </span>
                              ))}
                            {stadium.features.length > 2 && (
                              <span className="px-2 py-1 bg-[#333] text-gray-300 rounded-full text-xs">
                                +{stadium.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-auto">
                          <Link
                            to={`/stadiums/${stadium.id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex-1 text-center"
                          >
                            Details
                          </Link>
                          <Link
                            to={`/reserve/${stadium.id}?date=${filters.date}`}
                            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex-1 text-center"
                          >
                            Reserve
                          </Link>
                        </div>
                      </div>
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
                      length: Math.ceil(
                        filteredStadiums.length / stadiumsPerPage
                      ),
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
          ) : (
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
              <h2 className="text-2xl font-semibold mb-4 text-white">
                No stadiums found
              </h2>
              <p className="text-gray-300 mb-6">
                No stadiums match your search criteria. Please try different
                filters.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reserve;
