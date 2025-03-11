"use client";

import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";

const Navbar = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Define nav links based on user type
  const navLinks = [
    { name: "Stadiums", path: "/stadiums" },
    { name: "Reserve", path: "/reserve" },
    { name: "My Reservations", path: "/my-reservations" },
    { name: "Teams", path: "/teams" },
    { name: "Matches", path: "/matches" },
    { name: "Profile", path: "/profile" },
  ];

  // Add dashboard link for stadium owners
  if (user && user.userType === "owner") {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
  }

  return (
    <nav className="bg-[#1a1a1a] border-b border-white/10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-green-400 font-bold text-xl">
              StadTap
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.startsWith(link.path)
                      ? "bg-green-500 text-white"
                      : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <button
              onClick={onLogout}
              className="ml-4 px-4 py-2 rounded-full text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Log out
            </button>
          </div>

          <div className="md:hidden flex items-center">
            {/* Mobile menu button */}
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
