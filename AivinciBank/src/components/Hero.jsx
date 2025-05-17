"use client";

import { useState, useEffect, useRef } from "react";

const Hero = () => {
  const slides = [
    {
      id: 1,
      title: "Aivinci Star Kartı",
      description:
        "Üstünlüklərlə dolu bu kartla ürəyincə xərclə, məbləği ay sonu geri qaytardıqda əlavə heç nə ödəmə.",
      color: "from-primary/40 to-primary/5",
      buttonColor: "bg-teal-500 hover:bg-primary/90",
    },
    {
      id: 2,
      title: "Nağd Pul Krediti",
      description:
        "50 000 AZN-dək krediti sərfəli şərtlərlə, asanlıqla və çox qısa zamanda əldə et.",
      color: "from-secondary/40 to-secondary/5",
      buttonColor: "bg-lime-500 hover:bg-secondary/90",
    },
    {
      id: 3,
      title: "Depozit Yerləşdir",
      description:
        "Yüksək faiz dərəcələri ilə pulunuzu artırın və gələcəyinizi təmin edin.",
      color: "from-accent/40 to-accent/5",
      buttonColor: "bg-amber-500 hover:bg-accent/90",
    },
  ];

  const icons = {
    "credit-card": (
      <svg
        width="24"
        height="24"
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
    check: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    chip: (
      <svg
        width="40"
        height="30"
        viewBox="0 0 40 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="30" rx="4" fill="url(#chipGradient)" />
        <path
          d="M9 15.5H31M9 8.5H31M9 22.5H31"
          stroke="#8B7500"
          strokeWidth="1.5"
        />
        <path d="M15 4.5V25.5M23 4.5V25.5" stroke="#8B7500" strokeWidth="1.5" />
        <defs>
          <linearGradient
            id="chipGradient"
            x1="0"
            y1="0"
            x2="40"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD700" />
            <stop offset="1" stopColor="#B8860B" />
          </linearGradient>
        </defs>
      </svg>
    ),
    contactless: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.5 14.5C10 16 13 16.5 14.5 14.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.5 12.5C9 15 15 15.5 17.5 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4.5 10.5C8 14 16 14.5 19.5 10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    frontCard: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M7 10H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M7 14H12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    backCard: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
        <path
          d="M14 14H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    autoFlip: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 2L21 6M21 6L17 10M21 6H7C4.79086 6 3 7.79086 3 10V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 22L3 18M3 18L7 14M3 18H17C19.2091 18 21 16.2091 21 14V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef(null);
  const autoplayRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || currentSlide === index) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevSlide();
    }
  };

  // Autoplay
  useEffect(() => {
    if (isHovering) return;

    autoplayRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [currentSlide, isAnimating, isHovering]);

  // Parallax effect for slide content
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!slideRef.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } =
        slideRef.current.getBoundingClientRect();

      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      const contentEl = slideRef.current.querySelector(".slide-content");
      const imageEl = slideRef.current.querySelector(".slide-image");

      if (contentEl) {
        contentEl.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      }

      if (imageEl) {
        imageEl.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Ultra-modern banking illustrations for each slide
  const renderModernBankingIllustration = (slideId) => {
    switch (slideId) {
      case 1: // Ultra-modern Credit Card
        return (
          <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-[420px] h-[320px] flex items-center justify-center">
              {/* Background elements */}
              <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-teal-300/20 to-teal-600/30 blur-2xl"></div>
              <div className="absolute w-[200px] h-[200px] -right-20 -bottom-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-2xl"></div>

              {/* Modern Credit Card */}
              <div className="relative w-[380px] h-[220px] group">
                {/* Card base with glassmorphism effect */}
                <div className="absolute inset-0 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 transition-all duration-500 group-hover:shadow-[0_20px_70px_-15px_rgba(30,157,110,0.6)] group-hover:scale-105">
                  {/* Card background pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 380 220"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0H380V220H0V0Z" fill="url(#cardPattern)" />
                      <defs>
                        <pattern
                          id="cardPattern"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#cardPatternImage"
                            transform="scale(0.005 0.00833333)"
                          />
                        </pattern>
                        <image
                          id="cardPatternImage"
                          width="200"
                          height="120"
                          xlinkHref="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTAgMEgyMDBWMTIwSDBWMFoiIGZpbGw9InVybCgjcGF0dGVybikiLz4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuQ29udGVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgd2lkdGg9IjAuMSIgaGVpZ2h0PSIwLjE2NjY2NyI+CiAgICAgIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KPC9zdmc+"
                        />
                      </defs>
                    </svg>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f1f] to-[#090909]"></div>

                  {/* Holographic effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></div>
                </div>

                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/70"></div>
                  <div className="absolute inset-0 opacity-22">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 800 500"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="400"
                        cy="250"
                        r="200"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                      />
                      <circle
                        cx="400"
                        cy="250"
                        r="300"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                      />
                      <circle
                        cx="400"
                        cy="250"
                        r="400"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                      />
                    </svg>
                  </div>
                </div>

                {/* Card content */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  {/* Top section with logo and chip */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-1">
                      <div className="text-white font-bold text-xl tracking-tight">
                        Aivinci
                      </div>
                      <div className="ml-1 text-white/80 font-normal">Bank</div>
                    </div>

                    {/* Contactless icon */}
                    <div className="flex items-center space-x-2">
                      <span className="text-white/90">{icons.contactless}</span>
                    </div>
                  </div>

                  {/* Chip */}
                  <div className="flex items-center mb-6">
                    <div className="mr-3">{icons.chip}</div>
                    <div className="text-xs text-white/80 uppercase tracking-wider font-medium bg-white/10 px-2 py-1 rounded-sm">
                      Premium
                    </div>
                  </div>

                  {/* Card number with modern spacing */}
                  <div className="mb-auto">
                    <div className="text-white/70 text-xs mb-1 uppercase tracking-wider">
                      Card Number
                    </div>
                    <div className="text-white font-mono tracking-widest text-lg flex space-x-4">
                      <span>4582</span>
                      <span>••••</span>
                      <span>••••</span>
                      <span>3842</span>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="flex justify-between items-end mt-2">
                    <div className="w-3/5">
                      <div className="text-white/70 text-xs uppercase tracking-wider">
                        Card Holder
                      </div>
                      <div className="text-white font-medium text-sm truncate">
                        Sabina Allahverdiyeva
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wider">
                        Expires
                      </div>
                      <div className="text-white font-medium">05/28</div>
                    </div>
                  </div>
                </div>

                {/* Card network logo */}
                <div className="absolute bottom-13 right-5 w-16 h-16 flex items-center justify-center">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#FF5F00] rounded-full opacity-90"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-80 translate-x-[-30%]"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#F79E1B] rounded-full opacity-80 translate-x-[30%]"></div>
                    </div>
                  </div>
                </div>

                {/* Premium indicator */}
                <div className="absolute -top-3 -right-3 w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center"></div>
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/30 to-teal-600/30 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/10 animate-float">
                <div className="text-white text-xl font-bold">0%</div>
              </div>

              <div className="absolute -bottom-5 right-0 w-32 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <div className="text-white text-sm font-medium">
                  Cashback 5%
                </div>
              </div>
            </div>
          </div>
        );
      case 2: // Ultra-modern Cash Loan
        return (
          <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-[420px] h-[320px] flex items-center justify-center">
              {/* Background elements */}
              <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-lime-300/20 to-lime-600/30 blur-2xl"></div>
              <div className="absolute w-[200px] h-[200px] -left-20 -bottom-10 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 blur-2xl"></div>

              {/* Modern Loan Dashboard */}
              <div className="relative w-[380px]">
                {/* Main loan amount display */}
                <div className="relative z-20 mb-6">
                  <div className="bg-gradient-to-r from-lime-500 to-lime-600 rounded-2xl p-1 shadow-[0_10px_40px_-15px_rgba(132,204,22,0.8)]">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                      <div className="text-center">
                        <div className="text-white/70 text-sm mb-1">
                          Maksimum kredit məbləği
                        </div>
                        <div className="text-white text-4xl font-bold flex items-center justify-center">
                          <span className="text-white/80 mr-1 text-3xl">₼</span>
                          <span>50 000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan details card */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-lime-600/20 to-lime-700/20 p-5 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <div className="text-white font-medium text-lg">
                        Kredit Şərtləri
                      </div>
                      <div className="bg-lime-500 text-white text-xs px-3 py-1 rounded-full">
                        Sərfəli
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Loan parameters */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                        <div className="text-white/60 text-xs mb-1">Müddət</div>
                        <div className="text-white font-medium">36 ay</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                        <div className="text-white/60 text-xs mb-1">Faiz</div>
                        <div className="text-white font-medium">10.5%</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                        <div className="text-white/60 text-xs mb-1">
                          Aylıq ödəniş
                        </div>
                        <div className="text-white font-medium">₼ 1,620</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <div>Minimum</div>
                        <div>Maksimum</div>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-lime-400 to-lime-500 w-3/4 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <div>₼ 500</div>
                        <div>₼ 50,000</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center text-white/80 text-sm">
                        <svg
                          className="w-4 h-4 mr-2 text-lime-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Sürətli təsdiq prosesi</span>
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <svg
                          className="w-4 h-4 mr-2 text-lime-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Aşağı faiz dərəcəsi</span>
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <svg
                          className="w-4 h-4 mr-2 text-lime-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Çevik ödəniş qrafiki</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V16M8 12H16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Ultra-modern Deposit
        return (
          <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-[420px] h-[320px] flex items-center justify-center">
              {/* Background elements */}
              <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-300/20 to-amber-600/30 blur-2xl"></div>
              <div className="absolute w-[200px] h-[200px] -right-20 -top-10 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 blur-2xl"></div>

              {/* Modern Deposit Dashboard */}
              <div className="relative w-[380px] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 p-5 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <div className="text-white font-medium text-lg">
                      Depozit Gəliri
                    </div>
                    <div className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      <span>Premium</span>
                    </div>
                  </div>
                </div>

                {/* Interest rate display */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-white/70">İllik faiz dərəcəsi</div>
                    <div className="text-3xl font-bold text-white flex items-center">
                      <span className="text-amber-300 mr-1">+</span>12%
                    </div>
                  </div>

                  {/* Modern chart */}
                  <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white/70 text-sm">
                        Depozit artımı
                      </div>
                      <div className="text-white/70 text-xs">12 ay</div>
                    </div>

                    {/* Minimalist chart */}
                    <div className="h-[120px] relative">
                      {/* Chart grid */}
                      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className="border-t border-l border-white/5"
                          ></div>
                        ))}
                      </div>

                      {/* Chart line */}
                      <svg
                        className="absolute inset-0"
                        viewBox="0 0 300 120"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgba(245, 158, 11, 0.5)"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgba(245, 158, 11, 0)"
                            />
                          </linearGradient>
                          <linearGradient
                            id="lineGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>

                        {/* Area fill */}
                        <path
                          d="M0,100 L0,80 C20,75 40,85 60,70 C80,55 100,40 120,45 C140,50 160,30 180,25 C200,20 220,15 240,10 C260,5 280,15 300,5 L300,100 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Line */}
                        <path
                          d="M0,80 C20,75 40,85 60,70 C80,55 100,40 120,45 C140,50 160,30 180,25 C200,20 220,15 240,10 C260,5 280,15 300,5"
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Key data points */}
                        <circle cx="0" cy="80" r="3" fill="#f59e0b" />
                        <circle cx="120" cy="45" r="3" fill="#f59e0b" />
                        <circle cx="240" cy="10" r="3" fill="#f59e0b" />
                        <circle
                          cx="300"
                          cy="5"
                          r="5"
                          fill="#f59e0b"
                          stroke="white"
                          strokeWidth="1"
                          className="animate-ping-slow"
                        />
                      </svg>
                    </div>

                    {/* Chart labels */}
                    <div className="flex justify-between text-xs text-white/60 mt-2">
                      <div>0 ay</div>
                      <div>6 ay</div>
                      <div>12 ay</div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-white/60 text-xs mb-1">
                        Başlanğıc
                      </div>
                      <div className="text-white font-medium">₼ 10,000</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-white/60 text-xs mb-1">Qazanc</div>
                      <div className="text-amber-300 font-medium">+₼ 1,200</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-white/60 text-xs mb-1">Yekun</div>
                      <div className="text-white font-medium">₼ 11,200</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="relative h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={index === currentSlide ? slideRef : null}
          className={`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Slide background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}
          ></div>

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 mix-blend-overlay blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-secondary/10 mix-blend-overlay blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 slide-content transition-transform duration-200 ease-out">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 display-font">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-xl">
                {slide.description}
              </p>
              <button
                className={`group relative overflow-hidden rounded-full py-3 px-8 ${slide.buttonColor} text-white transition-all duration-300 hover:shadow-lg`}
              >
                <span className="relative z-10">Ətraflı</span>
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <svg
                  className="inline-block ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center slide-image transition-transform duration-200 ease-out">
              {/* Render ultra-modern banking illustrations */}
              {renderModernBankingIllustration(slide.id)}
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              currentSlide === index
                ? "w-16 h-2 bg-white"
                : "w-8 h-2 bg-white/50 hover:bg-white/80"
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
        aria-label="Next slide"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Hero;
