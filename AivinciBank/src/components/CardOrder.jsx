"use client";

import { useRef, useEffect, useState } from "react";

const CardOrder = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(true);

  // Animation intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(".card-animate");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Auto flip animation
  useEffect(() => {
    if (!autoFlip) return;

    const flipInterval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 5000);

    return () => clearInterval(flipInterval);
  }, [autoFlip]);

  // 3D card effect
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e) => {
      if (!card) return;

      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      card.style.transform = `
        perspective(1000px)
        rotateY(${isFlipped ? 180 + x * 15 : x * 15}deg)
        rotateX(${y * -15}deg)
        translateZ(10px)
      `;
    };

    const handleMouseLeave = () => {
      if (!card) return;

      card.style.transform = `
        perspective(1000px)
        rotateY(${isFlipped ? 180 : 0}deg)
        rotateX(0)
        translateZ(0)
      `;
      card.style.transition = "transform 0.5s ease";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isFlipped]);

  // Handle manual flip
  const handleFlip = (flipState) => {
    setAutoFlip(false);
    setIsFlipped(flipState);
  };

  // Resume auto flip
  const handleResumeAutoFlip = () => {
    setAutoFlip(true);
  };

  // Custom SVG icons
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

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 card-animate opacity-0 transform translate-y-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 display-font">
              Aivinci kartları ilə xüsusi təklif və imkanlardan yararlan
            </h2>
            <p className="text-lg mb-10">
              Visa və MasterCard® beynəlxalq ödəniş sistemlərini dəstəkləyən
              kartlarla dünyanın istənilən yerində ödənişlər etmək imkanına
              sahib ol.
            </p>

            <div className="space-y-8 mb-10">
              <div
                className="flex items-start card-animate opacity-0 transform translate-y-8 group p-4 rounded-xl hover:bg-surface-hover transition-all duration-300"
                style={{ transitionDelay: "100ms" }}
              >
                <div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    Aivinci Star
                  </h3>
                  <p className="text-foreground/70">
                    Üstünlüklərlə dolu bu kartla ürəyincə xərclə, məbləği ay
                    sonu geri qaytardıqda əlavə heç nə ödəmə.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start card-animate opacity-0 transform translate-y-8 group p-4 rounded-xl hover:bg-surface-hover transition-all duration-300"
                style={{ transitionDelay: "200ms" }}
              >
                <div>
                  <h3 className="font-semibold mb-2 group-hover:text-secondary transition-colors duration-300">
                    Aivinci Premium
                  </h3>
                  <p className="text-foreground/70">
                    Premium xidmətlər, yüksək limitlər və xüsusi təkliflərlə
                    dolu kart.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start card-animate opacity-0 transform translate-y-8 group p-4 rounded-xl hover:bg-surface-hover transition-all duration-300"
                style={{ transitionDelay: "300ms" }}
              >
                <div>
                  <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                    Aivinci Taksit
                  </h3>
                  <p className="text-foreground/70">
                    Alış-verişlərinizi taksitlə ödəmək imkanı verən kart.
                  </p>
                </div>
              </div>
            </div>

            <button
              className={`group relative overflow-hidden rounded-full py-3 px-8 text-white transition-all duration-300 hover:shadow-lg mt-8 bg-lime-500`}
            >
              <span className="relative z-10">Daha ətraflı</span>
              <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
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

          <div
            className="lg:w-1/2 flex justify-center card-animate opacity-0 transform translate-x-1 mt-8"
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative">
              {/* Modern Credit Card */}
              <div className="credit-card">
                <div
                  ref={cardRef}
                  className={`credit-card-inner ${
                    isFlipped ? "is-flipped" : ""
                  }`}
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front of the card */}
                  <div className="credit-card-front">
                    {/* Card background with modern gradient and pattern */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/70"></div>
                      <div className="absolute inset-0 opacity-10">
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

                    <div className="absolute inset-0 p-6 flex flex-col">
                      {/* Card logo and chip */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="text-white font-bold text-xl tracking-tight">
                          Aivinci
                          <span className="ml-1 text-white/80 font-normal">
                            Bank
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white/90">
                            {icons.contactless}
                          </span>
                        </div>
                      </div>

                      {/* Chip and card type */}
                      <div className="flex items-center mb-6">
                        <div className="mr-3">{icons.chip}</div>
                        <div className="text-xs text-white/80 uppercase tracking-wider font-medium bg-white/10 px-2 py-1 rounded-sm">
                          Premium
                        </div>
                      </div>

                      {/* Card number */}
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

                      {/* Card holder and expiry */}
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
                  </div>

                  {/* Back of the card */}
                  <div className="credit-card-back">
                    {/* Card background with modern gradient */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/70"></div>
                      <div className="absolute inset-0 opacity-10">
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
                            strokeDasharray="2 4"
                          />
                          <circle
                            cx="400"
                            cy="250"
                            r="400"
                            fill="none"
                            stroke="white"
                            strokeDasharray="2 4"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col">
                      {/* Magnetic stripe */}
                      <div className="w-full h-12 bg-black/80 mt-6"></div>

                      <div className="p-6 flex flex-col flex-grow">
                        {/* Signature strip */}
                        <div className="flex justify-end mb-4 mt-4">
                          <div className="w-3/4">
                            <div className="bg-white/90 h-10 flex items-center px-3 mb-2 rounded-md">
                              <div className="w-full overflow-hidden">
                                <div className="font-mono text-black/50 text-sm italic overflow-hidden whitespace-nowrap">
                                  Sabina Allahverdiyeva
                                </div>
                              </div>
                              <div className="ml-auto font-mono text-black font-bold">
                                CVV
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Terms */}
                        <div className="text-white/80 text-xs mt-4 px-2">
                          <p className="line-clamp-2">
                            Bu kart Aivinci Bank-ın mülkiyyətidir. Bu kartın
                            istifadəsi kart sahibi müqaviləsinin şərtlərinə və
                            qaydalarına tabedir.
                          </p>
                        </div>

                        <div className="mt-auto flex justify-between items-end">
                          {/* Bank contact info */}
                          <div className="text-white/90 text-xs pb-4">
                            <div>Müştəri xidməti: +994 12 123 45 67</div>
                            <div>www.aivincibank.az</div>
                          </div>

                          {/* Card network logo */}
                          <div className="w-16 h-16 flex items-center justify-center">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card glow effect */}
              <div className="absolute -bottom-10 left-10 right-10 h-20 bg-gradient-to-b from-primary/20 to-transparent blur-xl rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .credit-card {
          width: 380px;
          height: 240px;
          perspective: 1000px;
        }

        .credit-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .credit-card-front,
        .credit-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15),
            0 5px 15px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          overflow: hidden;
        }

        .credit-card-front {
          background: transparent;
        }

        .credit-card-back {
          background: transparent;
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default CardOrder;
