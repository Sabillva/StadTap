"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const MainLayout = () => {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileButtonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Add scroll event listener to change header appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate menu position when it's shown
  useEffect(() => {
    if (showProfileMenu && profileButtonRef.current) {
      const buttonRect = profileButtonRef.current.getBoundingClientRect();
      const menuWidth = 224; // Width of the menu (w-56 = 14rem = 224px)
      const windowWidth = window.innerWidth;

      // Calculate top position (always below the button)
      const top = buttonRect.bottom + window.scrollY + 8;

      // Calculate left position (centered under the button)
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const idealLeft = buttonCenter - menuWidth / 2;

      // Ensure menu doesn't go off screen
      const left = Math.max(
        16,
        Math.min(windowWidth - menuWidth - 16, idealLeft)
      );

      setMenuPosition({ top, left });
    }
  }, [showProfileMenu]);

  // Update menu position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (showProfileMenu && profileButtonRef.current) {
        const buttonRect = profileButtonRef.current.getBoundingClientRect();
        const menuWidth = 224; // Width of the menu (w-56 = 14rem = 224px)
        const windowWidth = window.innerWidth;

        // Calculate top position (always below the button)
        const top = buttonRect.bottom + window.scrollY + 8;

        // Calculate left position (centered under the button)
        const buttonCenter = buttonRect.left + buttonRect.width / 2;
        const idealLeft = buttonCenter - menuWidth / 2;

        // Ensure menu doesn't go off screen
        const left = Math.max(
          16,
          Math.min(windowWidth - menuWidth - 16, idealLeft)
        );

        setMenuPosition({ top, left });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showProfileMenu]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileMenu &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

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

  // Define nav links based on user type
  const navLinks = [
    { path: "/stadiums", label: "Stadiums" },
    { path: "/reserve", label: "Reserve" },
    { path: "/my-reservations", label: "My Reservations" },
    { path: "/teams", label: "Teams" },
    { path: "/matches", label: "Matches" },
    { path: "/users", label: "Users" },
    { path: "/chat", label: "Chat" },
  ];

  // Define profile menu items
  const profileMenuItems = [
    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  // Add owner-specific menu items
  if (user?.userType === "owner") {
    profileMenuItems.push(
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        ),
      },
      {
        path: "/my-stadium",
        label: "My Stadium",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        ),
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#0e100f]">
      {/* Header - Fixed with glassmorphism effect */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 mx-25 mt-4">
        <div className="border-2 border-white/15 rounded-[30px] bg-[#0e100f]/70 backdrop-blur-[10px] mx-auto overflow-hidden">
          <div className="container mx-auto">
            <div className="flex justify-between items-center h-14 px-6">
              <motion.div
                className="flex-shrink-0 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/" className="text-2xl font-bold text-[#fffce1]">
                  Stad<span className="text-[#4de840]">Tap</span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center justify-center">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="mx-3"
                  >
                    <Link
                      to={item.path}
                      className="relative text-sm font-medium group"
                    >
                      <span
                        className={`${
                          isActive(item.path)
                            ? "text-[#fffce1]"
                            : "text-white/50 hover:text-[#fffce1] transition-colors duration-300"
                        } relative`}
                      >
                        {item.label}
                        {isActive(item.path) && (
                          <motion.span
                            className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#fffce1] rounded-full"
                            layoutId="activeNavIndicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* NEW Profile Button - Just an icon */}
              <div className="relative hidden lg:block">
                <motion.button
                  ref={profileButtonRef}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#0e100f] to-[#0e100f] rounded-full text-white/50 hover:text-[#fffce1] shadow-md hover:shadow-lg transition-all duration-300 p-2 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </motion.button>

                {/* Profile Menu - Using Portal to ensure it's at the root level */}
                {showProfileMenu &&
                  createPortal(
                    <motion.div
                      ref={profileMenuRef}
                      className="fixed z-50 w-50 bg-[#0e100f]/70 backdrop-blur-md border-2 border-white/15 rounded-3xl shadow-xl overflow-hidden"
                      style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                      }}
                      initial={{ opacity: 0, y: -10, x: -40 }}
                      animate={{ opacity: 1, y: 10 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-2 px-4 py-3 text-sm text-[#fffce1] hover:bg-white/10 transition-colors duration-150"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors duration-150"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>,
                    document.body
                  )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden text-[#fffce1] focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-7 h-5 flex flex-col justify-between">
                  <motion.div
                    className="w-full h-[2px] bg-[#fffce1] rounded-full"
                    animate={{
                      rotate: isMobileMenuOpen ? 45 : 0,
                      y: isMobileMenuOpen ? 10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                  <motion.div
                    className="w-full h-[2px] bg-[#fffce1] rounded-full"
                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div
                    className="w-full h-[2px] bg-[#fffce1] rounded-full"
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? -10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                </div>
              </motion.button>
            </div>

            {/* Mobile Navigation - Inside the navbar container */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="lg:hidden overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="py-2 px-4">
                    {/* Grid layout for nav links - 2 columns */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      {navLinks.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="relative group"
                        >
                          <Link
                            to={item.path}
                            className={`text-sm font-medium block py-1.5 ${
                              isActive(item.path)
                                ? "text-[#fffce1]"
                                : "text-white/50 hover:text-[#fffce1]"
                            } transition-colors duration-200`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#fffce1] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 my-2"></div>

                    {/* Profile menu items in mobile menu - also in grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      {profileMenuItems.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: (navLinks.length + index) * 0.05,
                          }}
                          className="relative group"
                        >
                          <Link
                            to={item.path}
                            className="text-sm font-medium flex items-center py-1.5 text-white/50 hover:text-[#fffce1] transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                          </Link>
                          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#fffce1] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Sign out button - more prominent */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay:
                          (navLinks.length + profileMenuItems.length) * 0.05,
                      }}
                      className="mt-3"
                    >
                      <motion.button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-2 px-6 rounded-full bg-gradient-to-br from-[#4de840] to-[#2ca322] text-[#0e100f] font-medium shadow-[4px_4px_8px_rgba(14,16,15,0.2),-1px_-1px_10px_rgba(255,255,255,0.2)]"
                        whileHover={{ scale: 0.95 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Sign out
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        className="pt-24 min-h-[calc(100vh-4rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        key={location.pathname}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;
