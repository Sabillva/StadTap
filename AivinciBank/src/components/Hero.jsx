"use client";

import { useState, useEffect, useRef } from "react";

const Hero = () => {
  const slides = [
    {
      id: 1,
      title: "Aivinci Star Kartı",
      description:
        "Üstünlüklərlə dolu bu kartla ürəyincə xərclə, məbləği ay sonu geri qaytardıqda əlavə heç nə ödəmə.",
      image: "/placeholder.svg?height=600&width=600",
      color: "from-primary/40 to-primary/5",
      buttonColor: "bg-teal-500 hover:bg-primary/90",
    },
    {
      id: 2,
      title: "Nağd Pul Krediti",
      description:
        "50 000 AZN-dək krediti sərfəli şərtlərlə, asanlıqla və çox qısa zamanda əldə et.",
      image: "/placeholder.svg?height=600&width=600",
      color: "from-secondary/40 to-secondary/5",
      buttonColor: "bg-lime-500 hover:bg-secondary/90",
    },
    {
      id: 3,
      title: "Depozit Yerləşdir",
      description:
        "Yüksək faiz dərəcələri ilə pulunuzu artırın və gələcəyinizi təmin edin.",
      image: "/placeholder.svg?height=600&width=600",
      color: "from-accent/40 to-accent/5",
      buttonColor: "bg-amber-500 hover:bg-accent/90",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef(null);
  const autoplayRef = useRef(null);

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
    autoplayRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [currentSlide, isAnimating]);

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
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="max-h-[50vh] md:max-h-[70vh] object-contain rounded-3xl shadow-lg transform transition-transform duration-700 hover:scale-105"
                style={{
                  filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))",
                }}
              />
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
    </div>
  );
};

export default Hero;
