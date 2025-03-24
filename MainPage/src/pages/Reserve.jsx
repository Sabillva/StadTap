"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showCityOptions, setShowCityOptions] = useState(false);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Get pagination items with ellipsis
  const getPaginationItems = () => {
    const totalPages = Math.ceil(filteredStadiums.length / stadiumsPerPage);

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first and last page
    const items = [1, totalPages];

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range to always show 3 pages if possible
    if (currentPage <= 2) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 3);
    }

    // Add ellipsis indicators
    if (startPage > 2) {
      items.push("start-ellipsis");
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages - 1) {
      items.push("end-ellipsis");
    }

    // Sort and remove duplicates
    return [...new Set(items)].sort((a, b) => {
      if (a === "start-ellipsis") return -1;
      if (b === "start-ellipsis") return 1;
      if (a === "end-ellipsis") return 1;
      if (b === "end-ellipsis") return -1;
      return a - b;
    });
  };

  // Soccer ball SVG for pagination
  const SoccerBallIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
    >
      <path d="M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10s10-4.477,10-10S17.523,2,12,2z M12,20c-4.418,0-8-3.582-8-8 s3.582-8,8-8s8,3.582,8,8S16.418,20,12,20z M16.414,10.586l-1.414-1.414L12,12.172L8.414,8.586L7,10l5,5L16.414,10.586z" />
    </svg>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-center text-[#fffce1]"
      >
        Reserve a Stadium
      </motion.h1>

      <motion.div
        variants={itemVariants}
        className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[30px] p-6 md:p-8 shadow-lg mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-[#fffce1] mb-2"
            >
              Select City
            </label>
            <div className="relative">
              <button
                onClick={() => setShowCityOptions(!showCityOptions)}
                className="w-full px-4 py-3 bg-[rgb(25,25,25)] border-2 backdrop-blur-[10px] border-white/15 rounded-3xl text-[#fffce1] hover:border-[#4de840] transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#4de840]"
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
                  {filters.city || "All Cities"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-2 transition-transform duration-200 ${
                    showCityOptions ? "rotate-180" : ""
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

              <AnimatePresence>
                {showCityOptions && (
                  <motion.div
                    className="absolute z-[9999] w-full bg-[rgb(25,25,25)] backdrop-blur-md border-2 border-white/15 rounded-3xl shadow-lg overflow-hidden"
                    style={{
                      top: "calc(100% + 8px)",
                      left: 0,
                      width: "100%",
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 max-h-60 overflow-y-auto backdrop-blur-[10px]">
                      <button
                        onClick={() => {
                          setFilters({ ...filters, city: "" });
                          setShowCityOptions(false);
                        }}
                        className={`w-full text-left px-4 py-2 my-1 rounded-3xl flex cursor-pointer items-center ${
                          filters.city === ""
                            ? "bg-[#4de840]/20 text-[#4de840]"
                            : "text-[#fffce1] hover:bg-[#4de840]/10 hover:text-[#fffce1]"
                        } transition-colors duration-200`}
                      >
                        All Cities
                      </button>

                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setFilters({ ...filters, city });
                            setShowCityOptions(false);
                          }}
                          className={`w-full text-left px-4 py-2 my-1 rounded-3xl flex cursor-pointer items-center ${
                            filters.city === city
                              ? "bg-[#4de840]/20 text-[#4de840]"
                              : "text-[#fffce1] hover:bg-[#4de840]/10 hover:text-[#fffce1]"
                          } transition-colors duration-200`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-[#fffce1] mb-2"
            >
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={filters.date}
                onChange={handleDateChange}
                min={today}
                className="w-full px-4 py-3 border-2 border-white/15 bg-[rgb(25,25,25)] text-[#fffce1] rounded-3xl shadow-sm focus:outline-none focus:border-[#4de840] focus:ring-1 focus:ring-[#4de840] transition-all duration-300 cursor-pointer"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#4de840]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSetToday}
                className="text-xs px-3 py-1 bg-[rgb(25,25,25)] text-[#fffce1]/70 rounded-full border border-white/10 hover:border-[#4de840]/30 hover:bg-[#4de840]/10 hover:text-[#fffce1] transition-all duration-200 cursor-pointer"
              >
                Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSetTomorrow}
                className="text-xs px-3 py-1 bg-[rgb(25,25,25)] text-[#fffce1]/70 rounded-full border border-white/10 hover:border-[#4de840]/30 hover:bg-[#4de840]/10 hover:text-[#fffce1] transition-all duration-200 cursor-pointer"
              >
                Tomorrow
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleClearDate}
                className="text-xs px-3 py-1 bg-[rgb(25,25,25)] text-[#fffce1]/70 rounded-full border border-white/10 hover:border-[#4de840]/30 hover:bg-[#4de840]/10 hover:text-[#fffce1] transition-all duration-200 cursor-pointer"
              >
                Clear
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <label className="block text-sm font-medium text-[#fffce1] mb-2">
              Sort By
            </label>
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="w-full px-4 py-3 bg-[rgb(25,25,25)] border-2 border-white/15 rounded-3xl text-[#fffce1] hover:border-[#4de840] transition-all duration-300 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#4de840]"
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

            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-2 bg-[rgb(25,25,25)] border-2 border-white/15 rounded-3xl shadow-lg z-10 backdrop-blur-[10px]"
                >
                  <div className="p-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSortChange("rating")}
                      className={`w-full text-left px-4 py-2 my-1 rounded-3xl flex cursor-pointer items-center justify-between ${
                        sortBy === "rating"
                          ? "bg-[#4de840]/20 text-[#4de840]"
                          : "text-[#fffce1] hover:bg-[#4de840]/10 hover:text-[#fffce1]"
                      } transition-colors duration-200`}
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
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSortChange("reviews")}
                      className={`w-full text-left px-4 py-2 my-1 rounded-3xl flex cursor-pointer items-center justify-between ${
                        sortBy === "reviews"
                          ? "bg-[#4de840]/20 text-[#4de840]"
                          : "text-[#fffce1] hover:bg-[#4de840]/10 hover:text-[#fffce1]"
                      } transition-colors duration-200`}
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
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSortChange("price")}
                      className={`w-full text-left px-4 py-2 my-1 rounded-3xl flex cursor-pointer items-center justify-between ${
                        sortBy === "price"
                          ? "bg-[#4de840]/20 text-[#4de840]"
                          : "text-[#fffce1] hover:bg-[#4de840]/10 hover:text-[#fffce1]"
                      } transition-colors duration-200`}
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
                    </motion.button>

                    {sortBy !== "none" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSortBy("none");
                          setShowSortOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white/50 hover:bg-red-500/10 hover:text-[#fffce1] rounded-3xl mt-1 flex items-center transition-colors duration-200 cursor-pointer"
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
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-sm font-medium text-[#fffce1] mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(filters.amenities).map(([key, value]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                  value
                    ? "bg-[#4de840]/20 border-2 border-[#4de840]/30"
                    : "bg-[rgb(25,25,25)] border border-white/10 hover:bg-[#4de840]/10 hover:border-[#4de840]/30"
                }`}
                onClick={() => handleAmenityChange(key)}
              >
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-md mr-2 flex items-center justify-center ${
                        value ? "bg-[#4de840]" : "border border-white/30"
                      }`}
                    >
                      {value && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#0e100f]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        value ? "text-[#4de840]" : "text-[#fffce1]/80"
                      }`}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                </div>
                {value && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-[#4de840]"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-8 py-3 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full text-lg font-medium hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 flex items-center relative overflow-hidden group cursor-pointer"
          >
            <span className="relative z-10">Search Stadiums</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 relative z-10"
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

            {/* Soccer ball pattern animation */}
            <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNjAiPjxwYXRoIGQ9Ik0wLDYwIEwwLDAgTDI0MCwwIEwyNDAsNjAgTDAsNjAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHBvbHlnb24gcG9pbnRzPSIwLDAgMjAsMCAxMCwxNSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjIwLDAgNDAsMCAzMCwxNSAxMCwxNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjQwLDAgNjAsMCA1MCwxNSAzMCwxNSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjYwLDAgODAsMCA3MCwxNSA1MCwxNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjgwLDAgMTAwLDAgOTAsMTUgNzAsMTUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMDAsMCAxMjAsMCAxMTAsMTUgOTAsMTUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsMCAxNDAsMCAxMzAsMTUgMTEwLDE1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTQwLDAgMTYwLDAgMTUwLDE1IDEzMCwxNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE2MCwwIDE4MCwwIDE3MCwxNSAxNTAsMTUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxODAsMCAyMDAsMCAxOTAsMTUgMTcwLDE1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjAwLDAgMjIwLDAgMjEwLDE1IDE5MCwxNSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjIyMCwwIDI0MCwwIDIzMCwxNSAyMTAsMTUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMCwxNSAzMCwxNSAyMCwzMCAwLDMwIDAsMTUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIzMCwxNSA1MCwxNSA0MCwzMCAyMCwzMCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjUwLDE1IDcwLDE1IDYwLDMwIDQwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iNzAsMTUgOTAsMTUgODAsMzAgNjAsMzAiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSI5MCwxNSAxMTAsMTUgMTAwLDMwIDgwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTEwLDE1IDEzMCwxNSAxMjAsMzAgMTAwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTMwLDE1IDE1MCwxNSAxNDAsMzAgMTIwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTUwLDE1IDE3MCwxNSAxNjAsMzAgMTQwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTcwLDE1IDE5MCwxNSAxODAsMzAgMTYwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTkwLDE1IDIxMCwxNSAyMDAsMzAgMTgwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjEwLDE1IDIzMCwxNSAyMjAsMzAgMjAwLDMwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjMwLDE1IDI0MCwxNSAyNDAsMzAgMjIwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMCwzMCAwLDQ1IDEwLDQ1IDIwLDMwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMjAsMzAgNDAsMzAgMzAsNDUgMTAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSI0MCwzMCA2MCwzMCA1MCw0NSAzMCw0NSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjYwLDMwIDgwLDMwIDcwLDQ1IDUwLDQ1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iODAsMzAgMTAwLDMwIDkwLDQ1IDcwLDQ1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMTAwLDMwIDEyMCwzMCAxMTAsNDUgOTAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsMzAgMTQwLDMwIDEzMCw0NSAxMTAsNDUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxNDAsMzAgMTYwLDMwIDE1MCw0NSAxMzAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxNjAsMzAgMTgwLDMwIDE3MCw0NSAxNTAsNDUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxODAsMzAgMjAwLDMwIDE5MCw0NSAxNzAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIyMDAsMzAgMjIwLDMwIDIxMCw0NSAxOTAsNDUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIyMjAsMzAgMjQwLDMwIDI0MCw0NSAyMzAsNDUiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSIxMCw0NSAzMCw0NSAyMCw2MCAwLDYwIDAuNDUsIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iMzAsNDUgNTAsNDUgNDAsNjAgMjAsNjAiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBvbHlnb24gcG9pbnRzPSI1MCw0NSA3MCw0NSA2MCw2MCA0MCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjcwLDQ1IDkwLDQ1IDgwLDYwIDYwLDYwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwb2x5Z29uIHBvaW50cz0iOTAsNDUgMTEwLDQ1IDEwMCw2MCA4MCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjExMCw0NSAxMzAsNDUgMTIwLDYwIDEwMCw2MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjEzMCw0NSAxNTAsNDUgMTQwLDYwIDEyMCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE1MCw0NSAxNzAsNDUgMTYwLDYwIDE0MCw2MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE3MCw0NSAxOTAsNDUgMTgwLDYwIDE2MCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjE5MCw0NSAyMTAsNDUgMjAwLDYwIDE4MCw2MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjIxMCw0NSAyMzAsNDUgMjIwLDYwIDIwMCw2MCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cG9seWdvbiBwb2ludHM9IjIzMCw0NSAyNDAsNDUgMjQwLDYwIDIyMCw2MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')] bg-repeat-x bg-size-contain -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100"></span>
          </motion.button>
        </motion.div>

        {/* Active filters display */}
        <AnimatePresence>
          {(filters.city ||
            filters.date ||
            Object.values(filters.amenities).some((v) => v) ||
            sortBy !== "none") &&
            searched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10"
              >
                <div className="text-sm text-[#fffce1]/50 mr-2">
                  Active filters:
                </div>

                {filters.city && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[rgb(37,37,37)] border border-white/15 text-[#fffce1] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>City: {filters.city}</span>
                  </motion.div>
                )}

                {filters.date && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[rgb(37,37,37)] border border-white/15 text-[#fffce1] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>Date: {filters.date}</span>
                  </motion.div>
                )}

                {Object.entries(filters.amenities).map(
                  ([key, value], index) =>
                    value && (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-[rgb(37,37,37)] border border-white/15 text-[#fffce1] px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      </motion.div>
                    )
                )}

                {sortBy !== "none" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#4de840]/20 border border-[#4de840]/30 text-[#4de840] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>
                      Sort:{" "}
                      {sortBy === "rating"
                        ? "Rating"
                        : sortBy === "reviews"
                        ? "Reviews"
                        : "Price"}{" "}
                      ({sortOrder === "desc" ? "High to Low" : "Low to High"})
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {searched && (
          <>
            {filteredStadiums.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold mb-6 text-[#fffce1]"
                >
                  Available Stadiums for {filters.date} in {filters.city}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentStadiums.map((stadium, index) => (
                    <motion.div
                      key={stadium.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-[#171717]/60 backdrop-blur-[10px] border-2 border-white/15 rounded-[20px] shadow-lg overflow-hidden hover:border-[#4de840] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
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
                            className="w-full h-48 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={handleImageError}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                          <div className="absolute top-0 left-0 m-3">
                            <div className="bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              {stadium.hourlyRate} AZN/h
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 p-3 md:hidden">
                            <h2 className="text-xl font-bold text-[#fffce1]">
                              {stadium.name}
                            </h2>
                          </div>
                        </div>
                        <div className="p-4 md:p-6 flex flex-col justify-between md:w-3/5">
                          <div>
                            <h2 className="text-xl font-bold text-[#fffce1] hidden md:block mb-2">
                              {stadium.name}
                            </h2>
                            <div className="flex items-center mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#4de840] mr-1"
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
                              <span className="text-[#fffce1]/70">
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
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-[#fffce1]">
                                {stadium.rating}{" "}
                                <span className="text-[#fffce1]/50">
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
                                    className="px-2 py-1 bg-[rgb(25,25,25)] border border-white/10 text-[#fffce1]/70 rounded-full text-xs"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              {stadium.features.length > 2 && (
                                <span className="px-2 py-1 bg-[rgb(25,25,25)] border border-white/10 text-[#fffce1]/70 rounded-full text-xs">
                                  +{stadium.features.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-auto">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1"
                            >
                              <Link
                                to={`/stadiums/${stadium.id}`}
                                className="block w-full px-4 py-2 bg-[#171717]/90 border-2 border-white/15 text-[#fffce1] rounded-full hover:border-[#4de840] hover:bg-[rgb(31,31,31)] transition-all duration-300 text-center"
                              >
                                Details
                              </Link>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1"
                            >
                              <Link
                                to={`/reserve/${stadium.id}?date=${filters.date}`}
                                className="block w-full px-4 py-2 bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] rounded-full hover:shadow-lg hover:shadow-[#4de840]/20 transition-all duration-300 text-center relative overflow-hidden group"
                              >
                                <span className="relative z-10">Reserve</span>
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredStadiums.length > stadiumsPerPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center mt-10"
                  >
                    <nav className="inline-flex items-center gap-3">
                      <button
                        onClick={() =>
                          paginate(currentPage > 1 ? currentPage - 1 : 1)
                        }
                        disabled={currentPage === 1}
                        className={`px-4 py-2 flex items-center rounded-3xl border-2 border-white/15 bg-[#171717]/70 backdrop-blur-[10px] cursor-pointer ${
                          currentPage === 1
                            ? "text-white/30 cursor-not-allowed"
                            : "text-[#fffce1] hover:bg-[#171717] hover:border-[#4de840]/50"
                        } transition-all duration-200`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
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
                        Prev
                      </button>

                      {/* Pentagon-shaped pagination buttons */}
                      <div className="flex gap-3">
                        {getPaginationItems().map((item, index) => {
                          if (
                            item === "start-ellipsis" ||
                            item === "end-ellipsis"
                          ) {
                            return (
                              <div
                                key={`ellipsis-${index}`}
                                className="w-10 h-10 flex items-center justify-center text-[#fffce1]/50"
                              >
                                ...
                              </div>
                            );
                          }

                          return (
                            <button
                              key={item}
                              onClick={() => paginate(item)}
                              className="relative w-12 h-12 flex items-center justify-center overflow-hidden transition-all duration-200 cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="-10 -10 120 120"
                                className="absolute inset-0 w-full h-full"
                              >
                                <polygon
                                  points="50,0 100,35 82,100 18,100 0,35"
                                  fill={
                                    currentPage === item ? "#2df827" : "#0e100f"
                                  }
                                  stroke="#444"
                                  strokeWidth="4"
                                  strokeLinejoin="round"
                                  className={`transition-all duration-300 ${
                                    currentPage === item
                                      ? "shadow-lg shadow-[#4de840]"
                                      : "hover:stroke-[#4de840]"
                                  }`}
                                />
                              </svg>
                              <span className="relative z-10 text-[#fffce1] font-medium">
                                {item}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() =>
                          paginate(
                            currentPage <
                              Math.ceil(
                                filteredStadiums.length / stadiumsPerPage
                              )
                              ? currentPage + 1
                              : currentPage
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(filteredStadiums.length / stadiumsPerPage)
                        }
                        className={`px-4 py-2 flex items-center rounded-3xl border-2 border-white/15 bg-[#171717]/60 backdrop-blur-[10px] cursor-pointer ${
                          currentPage ===
                          Math.ceil(filteredStadiums.length / stadiumsPerPage)
                            ? "text-white/30 cursor-not-allowed"
                            : "text-[#fffce1] hover:bg-[#171717] hover:border-[#4de840]/50"
                        } transition-all duration-200`}
                      >
                        Next
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
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
                    </nav>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 border-2 border-white/15 rounded-[30px] bg-[#0e100f]/70 backdrop-blur-[10px] shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 text-white/30 mx-auto mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold mb-3 text-[#fffce1]">
                  No stadiums found
                </h2>
                <p className="text-[#fffce1]/70 max-w-md mx-auto">
                  No stadiums available in {filters.city} on {filters.date}. Try
                  selecting a different city or date.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFilters({
                      ...filters,
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
                    setSearched(false);
                    setSortBy("none");
                  }}
                  className="mt-6 px-6 py-2 bg-[#0e100f]/80 border-2 border-white/15 text-[#fffce1] rounded-full hover:border-[#4de840] transition-all duration-300"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reserve;
