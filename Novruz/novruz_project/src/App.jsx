"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import CharacterCard from "./components/CharacterCard";
import InputForm from "./components/InputForm";
import ShareButton from "./components/ShareButton";
import { characters } from "./data/characters";
import FireAnimation from "./components/FireAnimation";

export default function App() {
  const [name, setName] = useState("");
  const [character, setCharacter] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const appRef = useRef(null);

  const handleSubmit = (inputName) => {
    setName(inputName);
    setIsFlipping(true);

    // Simulate processing time for more dramatic effect
    setTimeout(() => {
      // Deterministic character selection based on name
      // This creates a consistent result for the same name
      const nameSum = inputName
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const characterIndex = nameSum % characters.length;
      setCharacter(characters[characterIndex]);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsFlipping(false);
      setShowResult(true);
    }, 1500);
  };

  const resetForm = () => {
    setShowResult(false);
    setCharacter(null);
    setName("");
  };

  return (
    <div
      ref={appRef}
      className="min-h-screen bg-gradient-to-b from-amber-100 to-red-100 flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <FireAnimation />
        <div className="absolute top-10 right-10 animate-float">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt=""
            className="w-20 h-20 opacity-60"
          />
        </div>
        <div className="absolute bottom-10 left-10 animate-float-delay">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt=""
            className="w-16 h-16 opacity-60"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-2">
          Novruz Personaj Tapıcısı
        </h1>
        <p className="text-xl text-red-700">
          Adını daxil et və Novruz obrazını kəşf et!
        </p>
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputForm onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <CharacterCard
                name={name}
                character={character}
                isFlipping={isFlipping}
              />

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 transition-colors"
                >
                  Yenidən Sına
                </motion.button>

                <ShareButton name={name} character={character} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-red-800 relative z-10"
      >
        <p>Novruz Bayramınız Mübarək!</p>
      </motion.div>
    </div>
  );
}
