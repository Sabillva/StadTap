"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = ({ theme }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 z-[60] ${
        theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"
      } origin-left`}
      style={{ scaleX, opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.3 } }}
    >
      <div
        className={`h-full ${
          theme === "dark"
            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
            : "bg-gradient-to-r from-emerald-500 to-teal-500"
        }`}
      ></div>
    </motion.div>
  );
};

export default ScrollProgress;
