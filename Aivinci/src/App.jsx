"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SimpleTransitions from "./components/SimpleTransitions";
import CalculateBenefits from "./components/CalculateBenefits";
import CardOrder from "./components/CardOrder";
import Services from "./components/Services";
import News from "./components/News";
import ExchangeRates from "./components/ExchangeRates";
import AdditionalServices from "./components/AdditionalServices";
import Features from "./components/Features";
import CardShowcase from "./components/CardShowcase";
import Statistics from "./components/Statistics";
import MobileApp from "./components/MobileApp";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import FloatingButton from "./components/FloatingButton";
import ScrollProgress from "./components/ScrollProgress";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";

function App() {
  const [activeTab, setActiveTab] = useState("Fiziki");
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState("light");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const appRef = useRef(null);

  // Handle theme
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");

    // Add theme class to body
    document.body.className = theme === "dark" ? "dark" : "light";

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "light";
  }, [theme]);

  // Handle cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setCursorVariant("default");
    };

    const handleMouseLeave = () => {
      setCursorVariant("hidden");
    };

    const handleLinkEnter = () => {
      setCursorVariant("link");
    };

    const handleLinkLeave = () => {
      setCursorVariant("default");
    };

    const handleButtonEnter = () => {
      setCursorVariant("button");
    };

    const handleButtonLeave = () => {
      setCursorVariant("default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Add event listeners for interactive elements
    const links = document.querySelectorAll("a, [data-cursor='link']");
    const buttons = document.querySelectorAll("button, [data-cursor='button']");

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkEnter);
      link.addEventListener("mouseleave", handleLinkLeave);
    });

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", handleButtonEnter);
      button.addEventListener("mouseleave", handleButtonLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkEnter);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });

      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", handleButtonEnter);
        button.removeEventListener("mouseleave", handleButtonLeave);
      });
    };
  }, [isLoaded]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Preloader */}
      <AnimatePresence>
        {!isLoaded && <Preloader theme={theme} />}
      </AnimatePresence>

      {/* Custom cursor */}
      <Cursor position={cursorPosition} variant={cursorVariant} theme={theme} />

      {/* Main content */}
      <div
        ref={appRef}
        className={`min-h-screen transition-colors duration-500 ${
          theme === "dark" ? "bg-neutral-900" : "bg-neutral-50"
        }`}
      >
        <ScrollProgress theme={theme} />
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          toggleTheme={toggleTheme}
        />

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
                <Services theme={theme} />
                <AdditionalServices theme={theme} />
                <News theme={theme} />
                <Statistics theme={theme} />
                <MobileApp theme={theme} />
                <Testimonials theme={theme} />
                <Faq theme={theme} />
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
                theme === "dark" ? "text-neutral-100" : "text-neutral-800"
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
                    theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  Tezliklə xidmətinizdə olacağıq
                </motion.p>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-8 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-200 dark:bg-emerald-800/30 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500"></div>
                  </div>
                </motion.div>
                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setActiveTab("Fiziki")}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition shadow-xl"
                >
                  Fiziki səhifəsinə qayıt
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
