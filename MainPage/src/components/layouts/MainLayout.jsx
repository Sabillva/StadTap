"use client";

import { useState, useEffect, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const MainLayout = () => {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem("user");

    // Update context
    setUser(null);

    // Redirect to login
    navigate("/login");
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="min-h-screen bg-[#222]">
      {/* Header - Fixed at the top */}
      <header className="bg-[#2a2a2a] border-b border-gray-700 py-4 px-6 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Stad<span className="text-green-500">Tap</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/stadiums"
              className={`text-sm font-medium ${
                isActive("/stadiums")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Stadiums
            </Link>
            <Link
              to="/reserve"
              className={`text-sm font-medium ${
                isActive("/reserve")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Reserve
            </Link>
            <Link
              to="/my-reservations"
              className={`text-sm font-medium ${
                isActive("/my-reservations")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              My Reservations
            </Link>
            <Link
              to="/teams"
              className={`text-sm font-medium ${
                isActive("/teams")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Teams
            </Link>
            <Link
              to="/matches"
              className={`text-sm font-medium ${
                isActive("/matches")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Matches
            </Link>
            <Link
              to="/users"
              className={`text-sm font-medium ${
                isActive("/users")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Users
            </Link>
            <Link
              to="/chat"
              className={`text-sm font-medium ${
                isActive("/chat")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Chat
            </Link>
          </nav>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center text-white hover:text-gray-300"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <span className="hidden md:inline">
                {user?.firstName || "User"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#333] border border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#444]"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </Link>
                  {user?.userType === "owner" && (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#444]"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/my-stadium"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#444]"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Stadium
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#444]"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2a2a2a] border-b border-gray-700 fixed top-16 left-0 right-0 z-40">
          <nav className="container mx-auto py-4 px-6 flex flex-col space-y-4">
            <Link
              to="/stadiums"
              className={`text-sm font-medium ${
                isActive("/stadiums")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stadiums
            </Link>
            <Link
              to="/reserve"
              className={`text-sm font-medium ${
                isActive("/reserve")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reserve
            </Link>
            <Link
              to="/my-reservations"
              className={`text-sm font-medium ${
                isActive("/my-reservations")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Reservations
            </Link>
            <Link
              to="/teams"
              className={`text-sm font-medium ${
                isActive("/teams")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              to="/matches"
              className={`text-sm font-medium ${
                isActive("/matches")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              to="/users"
              className={`text-sm font-medium ${
                isActive("/users")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Users
            </Link>
            <Link
              to="/chat"
              className={`text-sm font-medium ${
                isActive("/chat")
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat
            </Link>
            {user?.userType === "owner" && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium ${
                    isActive("/dashboard")
                      ? "text-green-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-stadium"
                  className={`text-sm font-medium ${
                    isActive("/my-stadium")
                      ? "text-green-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Stadium
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Main Content - Add padding to account for fixed header */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
