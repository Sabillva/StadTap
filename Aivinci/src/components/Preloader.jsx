"use client"

import { motion } from "framer-motion"

const Preloader = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        theme === "dark" ? "bg-neutral-900" : "bg-neutral-50"
      }`}
    >
      <div className="relative w-40 h-40">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-4xl font-bold font-display bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
            Aivinci
          </div>
        </motion.div>

        {/* Spinner */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <motion.circle
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{
              pathLength: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="origin-center"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  )
}

export default Preloader
