"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SimpleTransitions from "./components/SimpleTransitions";
import CalculateBenefits from "./components/CalculateBenefits";
import CardOrder from "./components/CardOrder";
import AdditionalServices from "./components/AdditionalServices";
import News from "./components/News";
import Services from "./components/Services";
import Footer from "./components/Footer";
import FloatingButton from "./components/FloatingButton";
import ScrollProgress from "./components/ScrollProgress";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [activeTab, setActiveTab] = useState("Fiziki");
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    // Custom cursor effect
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = () => {
      setIsHovering(true);
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, [role="button"]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseout", handleMouseOut);
    });

    window.addEventListener("mousemove", handleMouseMove);

    // Apply theme class to body
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, [theme]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-500`}
    >
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "active" : ""}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          display: isLoaded ? "block" : "none",
          backgroundColor:
            theme === "dark"
              ? "rgba(74, 222, 128, 0.3)"
              : "rgba(39, 168, 115, 0.3)",
        }}
      ></div>

      {/* Loading screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-900 to-emerald-700"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "linear",
                }}
                className="w-24 h-24 rounded-full border-4 border-t-transparent border-green-300 mx-auto mb-8"
              ></motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-green-50 mb-4 font-display"
              >
                Aivinci Bank
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-green-100"
              >
                Gələcəyin bankçılığı yüklənir...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <ScrollProgress theme={theme} />

      <AnimatePresence mode="wait">
        {activeTab === "Fiziki" ? (
          <motion.div
            key="fiziki"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`transition-all duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="content-container">
              <Hero theme={theme} />
              <SimpleTransitions theme={theme} />
              <CalculateBenefits theme={theme} />
              <CardOrder theme={theme} />
              <AdditionalServices theme={theme} />
              <News theme={theme} />
              <Services theme={theme} />
              <Footer theme={theme} />
              <FloatingButton theme={theme} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="biznes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`container mx-auto px-4 py-40 text-center content-container min-h-screen flex flex-col items-center justify-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <div className="max-w-2xl mx-auto">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 font-display"
              >
                Biznes səhifəsi hazırlanır
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`mt-4 text-lg mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tezliklə xidmətinizdə olacağıq
              </motion.p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-8 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-200 dark:bg-green-800 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-green-500"></div>
                </div>
              </motion.div>
              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setActiveTab("Fiziki")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-green-50 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition shadow-xl"
              >
                Fiziki səhifəsinə qayıt
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-24 z-40 p-3 rounded-full shadow-lg transition-all duration-300 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        } ${
          theme === "dark"
            ? "bg-green-600 text-green-50 hover:bg-green-500"
            : "bg-green-500 text-green-50 hover:bg-green-600"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
