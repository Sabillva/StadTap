"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import stadiumsData from "../utils/stadiumsData";

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

  const [filteredStadiums, setFilteredStadiums] = useState([]);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const stadiumsPerPage = 4;

  const cities = ["Bakı", "Sumqayıt", "Gəncə"];

  const handleCityChange = (e) => {
    setFilters({ ...filters, city: e.target.value });
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
    let results = stadiumsData.filter(
      (stadium) => stadium.city === filters.city
    );

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

  // Get current stadiums for pagination
  const indexOfLastStadium = currentPage * stadiumsPerPage;
  const indexOfFirstStadium = indexOfLastStadium - stadiumsPerPage;
  const currentStadiums = filteredStadiums.slice(
    indexOfFirstStadium,
    indexOfLastStadium
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Disable past dates in date picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Reserve a Stadium
      </h1>

      <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              onChange={handleCityChange}
              className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                onClick={handleSetToday}
                className="text-xs px-2 py-1 bg-[#444] text-gray-300 rounded hover:bg-[#555]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleSetTomorrow}
                className="text-xs px-2 py-1 bg-[#444] text-gray-300 rounded hover:bg-[#555]"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={handleClearDate}
                className="text-xs px-2 py-1 bg-[#444] text-gray-300 rounded hover:bg-[#555]"
              >
                Clear
              </button>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-white mb-2">
              Amenities
            </span>
            <div className="space-y-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.amenities.recording}
                  onChange={() => handleAmenityChange("recording")}
                  className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333]"
                />
                <span className="ml-2 text-sm text-gray-300">Recording</span>
              </label>

              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.amenities.buffet}
                  onChange={() => handleAmenityChange("buffet")}
                  className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333]"
                />
                <span className="ml-2 text-sm text-gray-300">Buffet</span>
              </label>

              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.amenities.parking}
                  onChange={() => handleAmenityChange("parking")}
                  className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333]"
                />
                <span className="ml-2 text-sm text-gray-300">Parking</span>
              </label>

              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.amenities.shower}
                  onChange={() => handleAmenityChange("shower")}
                  className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333]"
                />
                <span className="ml-2 text-sm text-gray-300">Shower</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.amenities.lockerRoom}
                  onChange={() => handleAmenityChange("lockerRoom")}
                  className="rounded border-gray-600 text-green-500 focus:ring-green-500 bg-[#333]"
                />
                <span className="ml-2 text-sm text-gray-300">Locker Room</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {searched && (
        <>
          {filteredStadiums.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Available Stadiums for {filters.date} in {filters.city}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {currentStadiums.map((stadium) => (
                  <div
                    key={stadium.id}
                    className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden"
                  >
                    <img
                      src={stadium.image || "/placeholder.svg"}
                      alt={stadium.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 text-white">
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
                        <span className="text-gray-300">{stadium.city}</span>
                      </div>
                      <div className="flex items-center mb-4">
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
                        <span className="text-gray-300">
                          {stadium.hourlyRate} AZN/hour
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/stadiums/${stadium.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/reserve/${stadium.id}?date=${filters.date}`}
                          className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                          Reserve
                        </Link>
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
