"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import stadiumsData from "../utils/stadiumsData";

const Stadiums = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const stadiumsPerPage = 4;

  // Get current stadiums
  const indexOfLastStadium = currentPage * stadiumsPerPage;
  const indexOfFirstStadium = indexOfLastStadium - stadiumsPerPage;
  const currentStadiums = stadiumsData.slice(
    indexOfFirstStadium,
    indexOfLastStadium
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Football Stadiums
      </h1>

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
              <Link
                to={`/stadiums/${stadium.id}`}
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
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
            length: Math.ceil(stadiumsData.length / stadiumsPerPage),
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
                currentPage < Math.ceil(stadiumsData.length / stadiumsPerPage)
                  ? currentPage + 1
                  : currentPage
              )
            }
            disabled={
              currentPage === Math.ceil(stadiumsData.length / stadiumsPerPage)
            }
            className={`px-3 py-1 rounded-r-md border border-gray-600 ${
              currentPage === Math.ceil(stadiumsData.length / stadiumsPerPage)
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Stadiums;
