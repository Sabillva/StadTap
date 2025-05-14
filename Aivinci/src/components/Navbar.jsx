"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Search,
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
  Phone,
  LogIn,
  Globe,
} from "lucide-react";

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
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

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
            ? "bg-black/60 backdrop-blur-2xl shadow-[0_10px_50px_-12px_rgba(16,185,129,0.15)]"
            : "bg-white/60 backdrop-blur-2xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.05)]"
          : theme === "dark"
          ? "bg-black"
          : "bg-white"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Top navigation */}
        <div
          className={`flex justify-between items-center py-3 border-b ${
            theme === "dark" ? "border-neutral-800/30" : "border-neutral-100"
          }`}
        >
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("Fiziki")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "Fiziki"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.25)]"
                  : theme === "dark"
                  ? "bg-neutral-900/70 text-neutral-400 hover:bg-neutral-800/70 hover:text-white"
                  : "bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-800"
              }`}
              data-cursor="button"
            >
              Fiziki
            </button>
            <button
              onClick={() => setActiveTab("Biznes")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "Biznes"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.25)]"
                  : theme === "dark"
                  ? "bg-neutral-900/70 text-neutral-400 hover:bg-neutral-800/70 hover:text-white"
                  : "bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-800"
              }`}
              data-cursor="button"
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
                    ? "text-neutral-400 hover:text-emerald-400"
                    : "text-neutral-500 hover:text-emerald-600"
                } transition-colors hover:scale-110 transition-transform duration-300`}
                data-cursor="button"
              >
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50 ${
                      theme === "dark"
                        ? "bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/50 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25)]"
                        : "bg-white/90 backdrop-blur-xl border border-neutral-200/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
                    }`}
                  >
                    <div className="relative p-4">
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Axtar..."
                          className={`w-full pl-9 pr-4 py-3 rounded-xl focus:outline-none transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-neutral-800/50 border-none text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500/50"
                              : "bg-neutral-100/50 border-none text-neutral-800 placeholder-neutral-400 focus:ring-2 focus:ring-emerald-500/30"
                          }`}
                        />
                        <Search
                          size={16}
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            theme === "dark"
                              ? "text-neutral-500"
                              : "text-neutral-400"
                          }`}
                        />
                      </div>
                      <div
                        className={`mt-4 pt-3 border-t ${
                          theme === "dark"
                            ? "border-neutral-800/50"
                            : "border-neutral-200/50"
                        }`}
                      >
                        <p
                          className={`text-xs mb-2 ${
                            theme === "dark"
                              ? "text-neutral-500"
                              : "text-neutral-400"
                          }`}
                        >
                          Populyar axtarışlar
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <a
                              key={term}
                              href="#"
                              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
                                theme === "dark"
                                  ? "bg-neutral-800/50 text-neutral-300 hover:bg-emerald-900/30 hover:text-emerald-300"
                                  : "bg-neutral-100/70 text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700"
                              }`}
                              onClick={() => setSearchQuery(term)}
                              data-cursor="link"
                            >
                              {term}
                            </a>
                          ))}
                        </div>
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
                  ? "text-neutral-400 hover:text-emerald-400"
                  : "text-neutral-500 hover:text-emerald-600"
              } transition-colors hover:scale-110 transition-transform duration-300`}
              data-cursor="button"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="#"
              className={`${
                theme === "dark"
                  ? "text-neutral-400 hover:text-emerald-400"
                  : "text-neutral-500 hover:text-emerald-600"
              } transition-colors hover:scale-110 transition-transform duration-300`}
              data-cursor="link"
            >
              <Globe size={18} />
            </a>
            <a
              href="#"
              className={`${
                theme === "dark"
                  ? "text-neutral-400 hover:text-emerald-400"
                  : "text-neutral-500 hover:text-emerald-600"
              } transition-colors relative group hover:scale-110 transition-transform duration-300`}
              data-cursor="link"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-black"></span>
            </a>
            <a
              href="#"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-neutral-900/70 text-emerald-400 hover:bg-neutral-800/70 hover:text-emerald-300 hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.2)]"
                  : "bg-neutral-100/70 text-emerald-600 hover:bg-neutral-200/70 hover:text-emerald-700 hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.15)]"
              }`}
              data-cursor="link"
            >
              <LogIn size={16} />
              <span className="font-medium">Daxil ol</span>
            </a>
            <a
              href="tel:196"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] hover:translate-y-[-1px]"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.25)] hover:translate-y-[-1px]"
              }`}
              data-cursor="link"
            >
              <Phone size={16} />
              <span className="font-medium">196</span>
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <a
              href="/"
              className="flex-shrink-0 relative group"
              data-cursor="link"
            >
              <div
                className={`absolute -inset-2 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500 ${
                  theme === "dark"
                    ? "bg-emerald-400"
                    : "bg-gradient-to-r from-emerald-400 to-teal-600"
                }`}
              ></div>
              <img
                src="/logo.png?height=40&width=150"
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
                      ? "text-neutral-300 hover:text-emerald-400"
                      : "text-neutral-700 hover:text-emerald-600"
                  }`}
                  onMouseEnter={() =>
                    link.hasDropdown && setActiveLink(link.name)
                  }
                  onMouseLeave={() => setActiveLink(null)}
                  data-cursor="link"
                >
                  {link.icon && (
                    <span
                      className={
                        theme === "dark"
                          ? "text-emerald-400"
                          : "text-emerald-500"
                      }
                    >
                      {link.icon}
                    </span>
                  )}
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown
                      size={16}
                      className="ml-1 transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100"
                    />
                  )}
                  <span
                    className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300 ${
                      theme === "dark" ? "bg-emerald-400" : "bg-emerald-500"
                    }`}
                  ></span>
                </a>
                {link.hasDropdown && activeLink === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`absolute top-full left-0 mt-1 w-72 rounded-2xl overflow-hidden z-50 ${
                      theme === "dark"
                        ? "bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/50 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25)]"
                        : "bg-white/90 backdrop-blur-xl border border-neutral-200/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
                    }`}
                    onMouseEnter={() => setActiveLink(link.name)}
                    onMouseLeave={() => setActiveLink(null)}
                  >
                    <div className="py-2">
                      {link.dropdownItems.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className={`flex items-center px-4 py-3 text-sm transition-all duration-300 ${
                            theme === "dark"
                              ? "text-neutral-300 hover:bg-neutral-800/50 hover:text-emerald-400"
                              : "text-neutral-700 hover:bg-neutral-100/70 hover:text-emerald-600"
                          }`}
                          data-cursor="link"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                              theme === "dark"
                                ? "bg-neutral-800/70 text-emerald-400 group-hover:bg-emerald-900/30"
                                : "bg-neutral-100/70 text-emerald-600 group-hover:bg-emerald-50"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`font-medium block ${
                                theme === "dark"
                                  ? "text-neutral-200"
                                  : "text-neutral-800"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span
                              className={
                                theme === "dark"
                                  ? "text-neutral-500 text-xs"
                                  : "text-neutral-400 text-xs"
                              }
                            >
                              {item.description}
                            </span>
                          </div>
                          <ChevronRight
                            size={16}
                            className={`transition-transform duration-300 ${
                              theme === "dark"
                                ? "text-neutral-600"
                                : "text-neutral-300"
                            }`}
                          />
                        </a>
                      ))}
                      <div
                        className={`mt-2 pt-2 border-t px-4 py-2 ${
                          theme === "dark"
                            ? "border-neutral-800/50"
                            : "border-neutral-200/50"
                        }`}
                      >
                        <a
                          href="#"
                          className={`text-sm font-medium flex items-center transition-all duration-300 ${
                            theme === "dark"
                              ? "text-emerald-400 hover:text-emerald-300"
                              : "text-emerald-600 hover:text-emerald-700"
                          }`}
                          data-cursor="link"
                        >
                          Bütün {link.name.toLowerCase()}{" "}
                          <ChevronRight
                            size={14}
                            className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </a>
                      </div>
                    </div>
                  </motion.div>
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
                  ? "text-neutral-300 hover:text-emerald-400"
                  : "text-neutral-700 hover:text-emerald-600"
              } focus:outline-none transition-transform hover:scale-110 duration-300`}
              data-cursor="button"
            >
              <Search size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`${
                theme === "dark"
                  ? "text-neutral-300 hover:text-emerald-400"
                  : "text-neutral-700 hover:text-emerald-600"
              } focus:outline-none transition-transform hover:scale-110 duration-300`}
              data-cursor="button"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className={`${
                theme === "dark"
                  ? "text-neutral-300 hover:text-emerald-400"
                  : "text-neutral-700 hover:text-emerald-600"
              } focus:outline-none transition-transform hover:scale-110 duration-300`}
              data-cursor="button"
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`lg:hidden py-4 border-t overflow-hidden ${
                theme === "dark"
                  ? "border-neutral-800/30 bg-black/95 backdrop-blur-xl"
                  : "border-neutral-100 bg-white/95 backdrop-blur-xl"
              }`}
            >
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className={`border-b pb-2 ${
                      theme === "dark"
                        ? "border-neutral-800/30"
                        : "border-neutral-100"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between py-2 font-medium ${
                        theme === "dark"
                          ? "text-neutral-300 hover:text-emerald-400"
                          : "text-neutral-700 hover:text-emerald-600"
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
                        data-cursor="link"
                      >
                        {link.icon && (
                          <span
                            className={
                              theme === "dark"
                                ? "text-emerald-400"
                                : "text-emerald-500"
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
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className={`pl-4 py-2 space-y-2 rounded-xl mt-1 ${
                              theme === "dark"
                                ? "bg-neutral-800/30 backdrop-blur-sm"
                                : "bg-neutral-50/70 backdrop-blur-sm"
                            }`}
                          >
                            {link.dropdownItems.map((item, index) => (
                              <a
                                key={index}
                                href="#"
                                className={`flex items-center py-2 text-sm transition-all duration-300 ${
                                  theme === "dark"
                                    ? "text-neutral-300 hover:text-emerald-400"
                                    : "text-neutral-700 hover:text-emerald-600"
                                }`}
                                data-cursor="link"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    theme === "dark"
                                      ? "bg-neutral-700/50 text-emerald-400"
                                      : "bg-neutral-100/70 text-emerald-600"
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
                  className={`pt-4 border-t flex flex-col space-y-4 ${
                    theme === "dark"
                      ? "border-neutral-800/30"
                      : "border-neutral-100"
                  }`}
                >
                  <a
                    href="#"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-neutral-800/50 text-emerald-400 hover:bg-neutral-700/50 hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.2)]"
                        : "bg-neutral-100/70 text-emerald-600 hover:bg-neutral-200/70 hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.15)]"
                    }`}
                    data-cursor="link"
                  >
                    <LogIn size={16} />
                    <span className="font-medium">Daxil ol</span>
                  </a>
                  <a
                    href="tel:196"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] hover:translate-y-[-1px]"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-[0_4px_14px_0_rgba(16,185,129,0.25)] hover:translate-y-[-1px]"
                    }`}
                    data-cursor="link"
                  >
                    <Phone size={16} />
                    <span className="font-medium">196</span>
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`lg:hidden py-4 border-t ${
                theme === "dark"
                  ? "border-neutral-800/30 bg-black/95 backdrop-blur-xl"
                  : "border-neutral-100 bg-white/95 backdrop-blur-xl"
              }`}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Axtar..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-neutral-800/50 border-none text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500/50"
                      : "bg-neutral-100/70 border-none text-neutral-800 placeholder-neutral-400 focus:ring-2 focus:ring-emerald-500/30"
                  }`}
                  autoFocus
                />
                <Search
                  size={18}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                  }`}
                />
              </div>
              <div className="mt-3">
                <p
                  className={`text-xs mb-2 ${
                    theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                  }`}
                >
                  Populyar axtarışlar
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <a
                      key={term}
                      href="#"
                      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-neutral-800/50 text-neutral-300 hover:bg-emerald-900/30 hover:text-emerald-300"
                          : "bg-neutral-100/70 text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                      data-cursor="link"
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
