"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Cursor = ({ position, variant = "default", theme }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCursorPosition({ x: position?.x || 0, y: position?.y || 0 });
  }, [position]);

  const variants = {
    default: {
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
      width: 32,
      height: 32,
      backgroundColor:
        theme === "dark"
          ? "rgba(16, 185, 129, 0.2)"
          : "rgba(16, 185, 129, 0.2)",
      mixBlendMode: "difference",
    },
    link: {
      x: cursorPosition.x - 24,
      y: cursorPosition.y - 24,
      width: 48,
      height: 48,
      backgroundColor:
        theme === "dark"
          ? "rgba(16, 185, 129, 0.4)"
          : "rgba(16, 185, 129, 0.4)",
      mixBlendMode: "difference",
    },
    button: {
      x: cursorPosition.x - 32,
      y: cursorPosition.y - 32,
      width: 64,
      height: 64,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      mixBlendMode: "difference",
    },
    hidden: {
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
      width: 32,
      height: 32,
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block"
      variants={variants}
      animate={variant}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

export default Cursor;
