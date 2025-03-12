"use client";

import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const MainLayout = () => {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Close menus when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-green-500">StadTap</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/stadiums"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.includes("/stadiums")
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Stadiums
              </Link>
              <Link
                to="/reserve"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.includes("/reserve")
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Reserve
              </Link>
              <Link
                to="/teams"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.includes("/teams")
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Teams
              </Link>
              <Link
                to="/matches"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.includes("/matches")
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Matches
              </Link>
              <Link
                to="/my-reservations"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.includes("/my-reservations")
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                My Reservations
              </Link>
              {user.userType === "owner" && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.includes("/dashboard")
                      ? "bg-green-500 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName.charAt(0)}
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg
                  className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:hidden border-t border-gray-700`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/stadiums"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes("/stadiums")
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Stadiums
            </Link>
            <Link
              to="/reserve"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes("/reserve")
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reserve
            </Link>
            <Link
              to="/teams"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes("/teams")
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              to="/matches"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes("/matches")
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              to="/my-reservations"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes("/my-reservations")
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Reservations
            </Link>
            {user.userType === "owner" && (
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname.includes("/dashboard")
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes("/profile")
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with padding for fixed navbar */}
      <main className="pt-20 pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-green-500">StadTap</span>
              <p className="text-gray-400 text-sm mt-1">
                © 2025 StadTap. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
