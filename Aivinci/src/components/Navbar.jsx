"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  User,
  Bell,
  CreditCard,
  DollarSign,
  Landmark,
  ChevronRight,
  Moon,
  Sun,
  Briefcase,
  Gift,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (mobileSearchOpen) setMobileSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleMobileDropdown = (linkName) => {
    if (mobileActiveDropdown === linkName) {
      setMobileActiveDropdown(null);
    } else {
      setMobileActiveDropdown(linkName);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction and visibility
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false); // Scrolling down - hide navbar
      } else {
        setIsVisible(true); // Scrolling up - show navbar
      }

      // Set scrolled state for styling
      if (currentScrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

  const navLinks = [
    {
      name: "Kartlar",
      hasDropdown: true,
      icon: <CreditCard size={16} className="mr-2" />,
      dropdownItems: [
        {
          name: "Debet kartlar",
          description: "Gündəlik xərcləriniz üçün",
          icon: <CreditCard size={16} />,
        },
        {
          name: "Kredit kartlar",
          description: "Kredit limitli kartlar",
          icon: <CreditCard size={16} />,
        },
        {
          name: "Premium kartlar",
          description: "Əlavə üstünlüklərlə",
          icon: <CreditCard size={16} />,
        },
      ],
    },
    {
      name: "Kreditlər",
      hasDropdown: true,
      icon: <DollarSign size={16} className="mr-2" />,
      dropdownItems: [
        {
          name: "Nağd kredit",
          description: "Şəxsi ehtiyaclar üçün",
          icon: <DollarSign size={16} />,
        },
        {
          name: "İpoteka krediti",
          description: "Mənzil almaq üçün",
          icon: <DollarSign size={16} />,
        },
        {
          name: "Avtomobil krediti",
          description: "Avtomobil almaq üçün",
          icon: <DollarSign size={16} />,
        },
      ],
    },
    {
      name: "Əmanətlər",
      hasDropdown: true,
      icon: <Landmark size={16} className="mr-2" />,
      dropdownItems: [
        {
          name: "Müddətli əmanət",
          description: "Yüksək faiz dərəcəsi ilə",
          icon: <Landmark size={16} />,
        },
        {
          name: "Müddətsiz əmanət",
          description: "Sərbəst istifadə imkanı ilə",
          icon: <Landmark size={16} />,
        },
        {
          name: "Uşaq əmanəti",
          description: "Uşaqların gələcəyi üçün",
          icon: <Landmark size={16} />,
        },
      ],
    },
    {
      name: "Istiqraz",
      hasDropdown: false,
      icon: <TrendingUp size={16} className="mr-2" />,
      link: "#istiqraz",
    },
    {
      name: "Pul köçürmələri",
      hasDropdown: true,
      icon: <DollarSign size={16} className="mr-2" />,
      dropdownItems: [
        {
          name: "Ölkədaxili köçürmələr",
          description: "Ölkə daxilində pul köçürmələri",
          icon: <DollarSign size={16} />,
        },
        {
          name: "Beynəlxalq köçürmələr",
          description: "Xaricə pul köçürmələri",
          icon: <DollarSign size={16} />,
        },
        {
          name: "Kart-karta köçürmələr",
          description: "Kartdan karta pul köçürmələri",
          icon: <CreditCard size={16} />,
        },
      ],
    },
    {
      name: "Partnyorlar",
      hasDropdown: false,
      icon: <Briefcase size={16} className="mr-2" />,
      link: "#partnyorlar",
    },
    {
      name: "Kampaniyalar",
      hasDropdown: false,
      icon: <Gift size={16} className="mr-2" />,
      link: "#kampaniyalar",
    },
    {
      name: "Xəbərlər",
      hasDropdown: false,
      icon: <Bell size={16} className="mr-2" />,
      link: "#xəbərlər",
    },
  ];

  const popularSearches = [
    "Kredit",
    "Kart sifarişi",
    "Depozit",
    "Onlayn bank",
    "Valyuta məzənnəsi",
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? theme === "dark"
            ? "bg-gray-900/95 backdrop-blur-lg shadow-2xl shadow-green-900/20"
            : "bg-gray-100/95 backdrop-blur-lg shadow-xl"
          : theme === "dark"
          ? "bg-gray-900"
          : "bg-gray-100"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto px-4">
        {/* Top navigation */}
        <div
          className={`flex justify-between items-center py-3 border-b ${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab("Fiziki")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "Fiziki"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-green-50 shadow-md"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Fiziki
            </button>
            <button
              onClick={() => setActiveTab("Biznes")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "Biznes"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-green-50 shadow-md"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Biznes
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={toggleSearch}
                className={`${
                  theme === "dark"
                    ? "text-gray-300 hover:text-green-400"
                    : "text-gray-500 hover:text-green-600"
                } transition-colors`}
              >
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl p-4 z-50 ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Axtar..."
                        className={`w-full pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                            : "bg-gray-200 border-gray-300 text-gray-800 placeholder-gray-500"
                        }`}
                      />
                      <Search
                        size={16}
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div
                      className={`mt-4 pt-3 border-t ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-xs mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Populyar axtarışlar
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <a
                            key={term}
                            href="#"
                            className={`text-xs px-3 py-1.5 rounded-full hover:bg-green-100 hover:text-green-700 ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => setSearchQuery(term)}
                          >
                            {term}
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={toggleTheme}
              className={`${
                theme === "dark"
                  ? "text-gray-300 hover:text-green-400"
                  : "text-gray-500 hover:text-green-600"
              } transition-colors`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="#"
              className={`${
                theme === "dark"
                  ? "text-gray-300 hover:text-green-400"
                  : "text-gray-500 hover:text-green-600"
              } transition-colors`}
            >
              <Bell size={18} />
            </a>
            <a
              href="#"
              className={`${
                theme === "dark"
                  ? "text-gray-300 hover:text-green-400"
                  : "text-gray-500 hover:text-green-600"
              } transition-colors`}
            >
              <User size={18} />
            </a>
            <a
              href="tel:196"
              className={`font-medium hover:text-green-700 transition-colors ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              196
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 relative group">
              <div
                className={`absolute -inset-1 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500 ${
                  theme === "dark"
                    ? "bg-green-400"
                    : "bg-gradient-to-r from-green-400 to-green-600"
                }`}
              ></div>
              <img
                src="/placeholder.svg?height=40&width=150"
                alt="Aivinci Bank Logo"
                className={`h-10 relative ${
                  theme === "dark" ? "filter invert" : ""
                }`}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <a
                  href={link.link || `#${link.name.toLowerCase()}`}
                  className={`px-3 py-2 rounded-md font-medium flex items-center group ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-green-400"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  onMouseEnter={() =>
                    link.hasDropdown && setActiveLink(link.name)
                  }
                  onMouseLeave={() => setActiveLink(null)}
                >
                  {link.icon && (
                    <span
                      className={
                        theme === "dark" ? "text-green-400" : "text-green-500"
                      }
                    >
                      {link.icon}
                    </span>
                  )}
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown
                      size={16}
                      className="ml-1 transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                      theme === "dark" ? "bg-green-400" : "bg-green-500"
                    }`}
                  ></span>
                </a>
                {link.hasDropdown && activeLink === link.name && (
                  <div
                    className={`absolute top-full left-0 mt-1 w-72 rounded-xl overflow-hidden z-50 border shadow-2xl animate-in fade-in slide-in-from-top-5 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 shadow-green-900/20"
                        : "bg-gray-100 border-gray-200"
                    }`}
                    onMouseEnter={() => setActiveLink(link.name)}
                    onMouseLeave={() => setActiveLink(null)}
                  >
                    <div className="py-2">
                      {link.dropdownItems.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className={`flex items-center px-4 py-3 text-sm transition-colors ${
                            theme === "dark"
                              ? "text-gray-300 hover:bg-gray-700 hover:text-green-400"
                              : "text-gray-700 hover:bg-gray-200 hover:text-green-600"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              theme === "dark"
                                ? "bg-gray-700 text-green-400"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`font-medium block ${
                                theme === "dark"
                                  ? "text-gray-200"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-400 text-xs"
                                  : "text-gray-500 text-xs"
                              }
                            >
                              {item.description}
                            </span>
                          </div>
                          <ChevronRight
                            size={16}
                            className={
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }
                          />
                        </a>
                      ))}
                      <div
                        className={`mt-2 pt-2 border-t px-4 py-2 ${
                          theme === "dark"
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <a
                          href="#"
                          className={`text-sm font-medium flex items-center hover:underline ${
                            theme === "dark"
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        >
                          Bütün {link.name.toLowerCase()}{" "}
                          <ChevronRight size={14} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleMobileSearch}
              className={`${
                theme === "dark"
                  ? "text-gray-300 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              } focus:outline-none`}
            >
              <Search size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`${
                theme === "dark"
                  ? "text-gray-300 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              } focus:outline-none`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className={`${
                theme === "dark"
                  ? "text-gray-300 hover:text-green-400"
                  : "text-gray-700 hover:text-green-600"
              } focus:outline-none`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden py-4 border-t overflow-hidden ${
                theme === "dark"
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-gray-100"
              }`}
            >
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className={`border-b pb-2 ${
                      theme === "dark" ? "border-gray-800" : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between py-2 font-medium ${
                        theme === "dark"
                          ? "text-gray-300 hover:text-green-400"
                          : "text-gray-700 hover:text-green-600"
                      }`}
                      onClick={() =>
                        link.hasDropdown
                          ? toggleMobileDropdown(link.name)
                          : null
                      }
                    >
                      <a
                        href={link.link || `#${link.name.toLowerCase()}`}
                        className="flex items-center"
                        onClick={(e) => link.hasDropdown && e.preventDefault()}
                      >
                        {link.icon && (
                          <span
                            className={
                              theme === "dark"
                                ? "text-green-400"
                                : "text-green-500"
                            }
                          >
                            {link.icon}
                          </span>
                        )}
                        {link.name}
                      </a>
                      {link.hasDropdown && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            mobileActiveDropdown === link.name
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Mobile dropdown */}
                    <AnimatePresence>
                      {link.hasDropdown &&
                        mobileActiveDropdown === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`pl-4 py-2 space-y-2 rounded-lg mt-1 ${
                              theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                            }`}
                          >
                            {link.dropdownItems.map((item, index) => (
                              <a
                                key={index}
                                href="#"
                                className={`flex items-center py-2 text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300 hover:text-green-400"
                                    : "text-gray-700 hover:text-green-600"
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    theme === "dark"
                                      ? "bg-gray-700 text-green-400"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  {item.icon}
                                </div>
                                <span>{item.name}</span>
                              </a>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
                <div
                  className={`pt-4 border-t flex items-center justify-between ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <a
                    href="#"
                    className={`${
                      theme === "dark"
                        ? "text-gray-300 hover:text-green-400"
                        : "text-gray-500 hover:text-green-600"
                    } transition-colors`}
                  >
                    <User size={18} />
                  </a>
                  <a
                    href="#"
                    className={`${
                      theme === "dark"
                        ? "text-gray-300 hover:text-green-400"
                        : "text-gray-500 hover:text-green-600"
                    } transition-colors`}
                  >
                    <Bell size={18} />
                  </a>
                  <a
                    href="tel:196"
                    className={`font-medium hover:text-green-700 transition-colors ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    196
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden py-4 border-t ${
                theme === "dark"
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-gray-100"
              }`}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Axtar..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                      : "bg-gray-200 border-gray-300 text-gray-800 placeholder-gray-500"
                  }`}
                  autoFocus
                />
                <Search
                  size={18}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <div className="mt-3">
                <p
                  className={`text-xs mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Populyar axtarışlar
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <a
                      key={term}
                      href="#"
                      className={`text-xs px-3 py-1.5 rounded-full ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400"
                          : "bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-700"
                      }`}
                    >
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
