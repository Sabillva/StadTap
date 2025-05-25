"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Header = ({ customerType, setCustomerType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const accountMenuRef = useRef(null);
  const accountButtonRef = useRef(null);
  const headerRef = useRef(null);

  // Get username from localStorage if available
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });

  const navLinks = [
    {
      name: "Məhsullar",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "Kartlar", href: "#", icon: "credit-card" },
        { name: "Kreditlər", href: "#", icon: "dollar" },
        { name: "Əmanətlər", href: "#", icon: "wallet" },
        { name: "Istiqraz", href: "#", icon: "chart" },
      ],
    },
    {
      name: "Xidmətlər",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "Pul köçürmələri", href: "#", icon: "globe" },
        { name: "Valyuta mübadiləsi", href: "#", icon: "exchange" },
        { name: "Onlayn ödənişlər", href: "#", icon: "lightning" },
      ],
    },
    { name: "Partnyorlar", href: "#" },
    { name: "Kampaniyalar", href: "#" },
    { name: "Xəbərlər", href: "#" },
  ];

  const controlHeader = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle clicks outside of account menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAccountMenu &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target) &&
        accountButtonRef.current &&
        !accountButtonRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountMenu]);

  // Control body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen]);

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  // Icon components
  const icons = {
    "credit-card": (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 15H10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    dollar: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2V22M17 5H9.5C7.01472 5 5 7.01472 5 9.5C5 11.9853 7.01472 14 9.5 14H14.5C16.9853 14 19 16.0147 19 18.5C19 20.9853 16.9853 23 14.5 23H7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    wallet: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z"
          fill="currentColor"
        />
        <path
          d="M2 9H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    chart: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 21H3V3M21 9L15 15L9 9L3 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    globe: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    exchange: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 10L3 14L7 18M17 6L21 10L17 14M13 4L11 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    lightning: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 2L4.09344 12.6879C3.74463 13.1064 3.57023 13.3157 3.56756 13.4925C3.56524 13.6461 3.63372 13.7923 3.75324 13.8889C3.89073 14 4.16316 14 4.70802 14H12L11 22L19.9065 11.3121C20.2553 10.8936 20.4297 10.6843 20.4324 10.5075C20.4347 10.3539 20.3663 10.2077 20.2467 10.1111C20.1092 10 19.8368 10 19.292 10H12L13 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    user: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    sun: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 20V22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 12L2 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 12L20 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M19.7782 4.22183L17.5563 6.44365"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6.44365 17.5563L4.22183 19.7782"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M19.7782 19.7782L17.5563 17.5563"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6.44365 6.44365L4.22183 4.22183"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    moon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00008C7 6.02072 8.62867 3.42175 11.0443 2.04492C5.96975 2.52607 2 6.79936 2 12.0001C2 17.5229 6.47715 22.0001 12 22.0001C17.2002 22.0001 21.4733 18.0308 21.9548 12.9564Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    chevronDown: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    login: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 17L15 12L10 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 12H3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    userPlus: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M18 14L18 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 18L14 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 21C16 16.5817 13.3137 13 10 13C6.68629 13 4 16.5817 4 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    logout: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 17L21 12L16 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    menu: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 6H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 18H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    close: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <header
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? "header-backdrop shadow-md" : "bg-transparent"
      } ${isVisible ? "top-0" : "-top-full"}`}
    >
      {/* Top bar with customer type and account buttons */}
      <div
        className={`border-none ${
          isScrolled ? "border-border/20" : "border-border/10"
        }`}
      >
        <div className="container mx-auto px-16 py-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                className={`px-6 py-2 rounded-3xl transition-all font-medium ${
                  customerType === "fiziki"
                    ? "bg-gray-200 text-gray-800 dark:bg-[#282828] dark:text-gray-200"
                    : "bg-surface hover:bg-surface-hover text-foreground"
                }`}
                onClick={() => setCustomerType("fiziki")}
              >
                Fiziki
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all font-medium ${
                  customerType === "biznes"
                    ? "bg-gray-200 text-gray-800 dark:bg-[#282828] dark:text-gray-200"
                    : "bg-surface hover:bg-surface-hover text-foreground"
                }`}
                onClick={() => setCustomerType("biznes")}
              >
                Biznes
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-3xl bg-surface hover:bg-surface-hover transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <span className="text-foreground">{icons.sun}</span>
                ) : (
                  <span className="text-foreground">{icons.moon}</span>
                )}
              </button>

              <div className="relative">
                <button
                  ref={accountButtonRef}
                  className="flex items-center space-x-1 p-2 rounded-full bg-surface hover:bg-surface-hover transition-all text-foreground"
                  onClick={toggleAccountMenu}
                >
                  <span className="text-foreground">{icons.user}</span>
                </button>

                {showAccountMenu && (
                  <div
                    ref={accountMenuRef}
                    className="absolute right-0 mt-2 w-64 modern-dropdown z-50 scale-in"
                  >
                    <div className="px-4 py-3 border-b border-border/10">
                      <p className="text-sm text-muted">Xoş gəlmisiniz</p>
                      <p className="font-medium text-foreground">
                        {username ? username : "Aivinci Bank"}
                      </p>
                    </div>
                    {!username ? (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center px-4 py-3 hover:bg-primary/5 transition-colors rounded-md m-1"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              Daxil ol
                            </p>
                            <p className="text-xs text-muted">
                              Hesabınıza giriş edin
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center px-4 py-3 hover:bg-secondary/5 transition-colors rounded-md m-1"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              Qeydiyyat
                            </p>
                            <p className="text-xs text-muted">
                              Yeni hesab yaradın
                            </p>
                          </div>
                        </Link>
                      </>
                    ) : (
                      <button
                        className="flex items-center px-4 py-3 hover:bg-accent/5 transition-colors w-full text-left rounded-md m-1"
                        onClick={() => {
                          localStorage.removeItem("username");
                          setUsername(null);
                          setShowAccountMenu(false);
                        }}
                      >
                        <div>
                          <p className="font-medium text-foreground">Çıxış</p>
                          <p className="text-xs text-muted">
                            Hesabdan çıxış edin
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-16 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-8 flex items-center">
              <div className="text-2xl font-bold display-font text-foreground">
                Aivinci Bank
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navLinks.map((link, index) => (
              <div key={link.name} className="relative group">
                {link.hasDropdown ? (
                  <button
                    className="flex items-center text-foreground hover:text-primary transition-colors"
                    onClick={() => toggleDropdown(index)}
                  >
                    {link.name}
                    <span
                      className={`ml-1 transition-transform duration-300 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    >
                      {icons.chevronDown}
                    </span>
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className="link-hover text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                )}

                {link.hasDropdown && (
                  <div
                    className={`absolute left-0 mt-2 modern-dropdown transition-all duration-300 z-50 ${
                      activeDropdown === index
                        ? "opacity-100 visible scale-100"
                        : "opacity-0 invisible scale-95 pointer-events-none"
                    }`}
                    style={{
                      width: "max-content",
                      minWidth: "150px",
                      maxHeight:
                        activeDropdown === index
                          ? `${link.dropdownItems.length * 60 + 20}px`
                          : "0px",
                      overflow: "hidden",
                    }}
                  >
                    <div className="p-2 grid grid-cols-1">
                      {link.dropdownItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center p-3 hover:bg-primary/5 transition-colors rounded-md text-foreground"
                        >
                          <span className="text-sm">{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-3 rounded-full bg-surface hover:bg-surface-hover transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <span className="text-foreground">{icons.close}</span>
            ) : (
              <span className="text-foreground">{icons.menu}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation - top to bottom dropdown */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bg-background/95 backdrop-blur-xl absolute top-0 left-0 right-0 border-b border-border/10 shadow-lg overflow-y-auto max-h-[80vh] transform transition-transform duration-300 origin-top"
            style={{
              animation: "slideDown 0.3s ease-out forwards",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-xl font-bold display-font text-foreground">
                  Aivinci Bank
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center"
                aria-label="Close menu"
              >
                <span className="text-foreground">{icons.close}</span>
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <div
                    key={link.name}
                    className="py-2 border-b border-border/10"
                  >
                    {link.hasDropdown ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full py-2 text-foreground hover:text-primary transition-colors"
                          onClick={() => toggleDropdown(index)}
                        >
                          <span className="font-medium">{link.name}</span>
                          <span
                            className={`transition-transform duration-300 ${
                              activeDropdown === index ? "rotate-180" : ""
                            }`}
                          >
                            {icons.chevronDown}
                          </span>
                        </button>

                        {activeDropdown === index && (
                          <div className="pl-4 mt-2 space-y-3 mb-3">
                            {link.dropdownItems.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center py-2 px-3 rounded-md hover:bg-primary/5 transition-colors text-foreground"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <span className="text-sm">{item.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={link.href}
                        className="block py-2 font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-border/10">
                <div className="flex space-x-4 mb-4">
                  <button
                    className={`flex-1 px-4 py-2 rounded-full transition-all font-medium ${
                      customerType === "fiziki"
                        ? "bg-foreground text-background"
                        : "bg-surface text-foreground"
                    }`}
                    onClick={() => setCustomerType("fiziki")}
                  >
                    Fiziki
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 rounded-full transition-all font-medium ${
                      customerType === "biznes"
                        ? "bg-foreground text-background"
                        : "bg-surface text-foreground"
                    }`}
                    onClick={() => setCustomerType("biznes")}
                  >
                    Biznes
                  </button>
                </div>

                <div className="space-y-3">
                  {!username ? (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center p-3 rounded-md hover:bg-primary/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            Daxil ol
                          </p>
                          <p className="text-xs text-muted">
                            Hesabınıza giriş edin
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/register"
                        className="flex items-center p-3 rounded-md hover:bg-secondary/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            Qeydiyyat
                          </p>
                          <p className="text-xs text-muted">
                            Yeni hesab yaradın
                          </p>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <button
                      className="flex items-center p-3 rounded-md hover:bg-accent/5 transition-colors w-full text-left"
                      onClick={() => {
                        localStorage.removeItem("username");
                        setUsername(null);
                        setIsMenuOpen(false);
                      }}
                    >
                      <div>
                        <p className="font-medium text-foreground">Çıxış</p>
                        <p className="text-xs text-muted">
                          Hesabdan çıxış edin
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
