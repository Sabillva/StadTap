"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MousePointer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const carouselItems = [
  {
    id: 1,
    title: "Aivinci Star Kart ilə 10% keşbek qazanın",
    description:
      "Yeni Star kartınızla bütün alış-verişlərdə 10% keşbek əldə edin",
    image: "/placeholder.svg?height=800&width=1600",
    color: "from-green-600/90 to-emerald-700/90",
    buttonText: "Ətraflı məlumat",
  },
  {
    id: 2,
    title: "Yay kampaniyası - 0% faizlə kredit",
    description: "İndi sifariş edin, 6 ay ərzində 0% faizlə ödəyin",
    image: "/placeholder.svg?height=800&width=1600",
    color: "from-emerald-600/90 to-green-700/90",
    buttonText: "Kredit əldə et",
  },
  {
    id: 3,
    title: "Depozit yerləşdir, 12% illik qazanc əldə et",
    description: "Yüksək faizli depozit təkliflərimizlə pulunuzu artırın",
    image: "/placeholder.svg?height=800&width=1600",
    color: "from-green-700/90 to-emerald-800/90",
    buttonText: "Depozit yerləşdir",
  },
];

const Hero = ({ theme }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRefs = useRef([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    // Animate the current slide
    slideRefs.current.forEach((ref, index) => {
      if (index === currentSlide && ref) {
        ref.classList.add("scale-in");
        setTimeout(() => {
          ref.classList.remove("scale-in");
        }, 500);
      }
    });
  }, [currentSlide]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // Parallax effect based on mouse position
  const getParallaxStyle = (depth = 30) => {
    const x = (0.5 - mousePosition.x) * depth;
    const y = (0.5 - mousePosition.y) * depth;
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  return (
    <div
      className={`relative overflow-hidden h-[700px] md:h-[800px] ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-800"
      }`}
      ref={heroRef}
    >
      <AnimatePresence mode="wait">
        {carouselItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className={`absolute inset-0 flex-shrink-0 ${
              index === currentSlide ? "z-10" : "z-0"
            }`}
          >
            <div className="relative h-full overflow-hidden">
              {/* Background image with parallax effect */}
              <div
                className="absolute inset-0 transition-transform duration-500 ease-out"
                style={getParallaxStyle(20)}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover scale-110"
                />
              </div>

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-95`}
              ></div>

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-green-50"
                ref={(el) => (slideRefs.current[index] = el)}
              >
                <div className="container mx-auto max-w-6xl">
                  <div className="max-w-3xl" style={getParallaxStyle(10)}>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="inline-block px-4 py-1 bg-green-50/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
                    >
                      Aivinci Bank
                    </motion.span>
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
                    >
                      {item.title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-xl md:text-2xl mb-8 max-w-xl text-green-50/90 font-light"
                    >
                      {item.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <button className="px-8 py-4 bg-green-50 text-green-700 rounded-full font-medium hover:bg-green-100 transition flex items-center justify-center group shadow-xl">
                        {item.buttonText}
                        <ArrowRight
                          size={18}
                          className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                      <button className="px-8 py-4 bg-transparent border border-green-50/30 backdrop-blur-sm text-green-50 rounded-full font-medium hover:bg-green-50/10 transition flex items-center justify-center">
                        Ətraflı
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-green-50/10 backdrop-blur-md p-3 rounded-full hover:bg-green-50/20 transition text-green-50 z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-green-50/10 backdrop-blur-md p-3 rounded-full hover:bg-green-50/20 transition text-green-50 z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-green-50 w-20" : "bg-green-50/40"
            }`}
          ></button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce hidden md:flex z-20"
      >
        <MousePointer size={20} className="text-green-50 mb-2" />
        <span className="text-green-50 text-xs font-medium">Scroll</span>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-green-50/10 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-green-50/10 rounded-full animate-pulse opacity-20"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 border border-green-50/10 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
};

export default Hero;
