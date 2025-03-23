"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CharacterCard({ name, character, isFlipping }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!isFlipping && character) {
      const timer = setTimeout(() => {
        setFlipped(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!character) {
      setFlipped(false);
    }
  }, [isFlipping, character]);

  if (!character) return null;

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto">
      <motion.div
        className={`relative w-full h-96 rounded-2xl shadow-xl transition-all duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl">🎭</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Novruz Personajın
            </h2>
            <p className="text-white text-lg">Kart çevrilir...</p>
          </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center overflow-hidden"
            >
              <span className="text-6xl">{character.emoji}</span>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {character.name}
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <p className="text-white text-xl mb-4">{name}</p>
              <p className="text-white">{character.description}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
