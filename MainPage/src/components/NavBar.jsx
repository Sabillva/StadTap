"use client";

import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { motion } from "framer-motion";

const Navbar = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to change navbar appearance on scroll
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
    navLinks.push({ name: "My Stadium", path: "/my-stadium" });
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/80 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-card/70 backdrop-blur-sm border-b border-white/5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex-shrink-0 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="text-primary font-bold text-xl flex items-center"
            >
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                StadTap
              </motion.span>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname.startsWith(link.path)
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {location.pathname.startsWith(link.path) && (
                      <motion.span
                        className="absolute inset-0 bg-primary rounded-md -z-10"
                        layoutId="navBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <motion.button
              onClick={onLogout}
              className="ml-4 px-5 py-2 rounded-full text-sm font-medium text-white bg-destructive hover:bg-destructive/80 transition-colors duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log out
            </motion.button>
          </motion.div>

          <div className="md:hidden flex items-center">
            {/* Mobile menu button */}
            <motion.button
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
              whileTap={{ scale: 0.9 }}
            >
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
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
