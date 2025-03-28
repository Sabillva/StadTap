"use client";

import { motion } from "framer-motion";

function MenuButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-black bg-opacity-50 p-2 rounded-full text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </motion.button>
  );
}

export default MenuButton;
