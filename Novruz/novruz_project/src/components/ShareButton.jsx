"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ShareButton({ name, character }) {
  const [shared, setShared] = useState(false);

  if (!character) return null;

  const shareText = `Mən Novruz Personaj Tapıcısında "${character.name}" çıxdım! Sən də öz Novruz personajını tap!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Novruz Personaj Tapıcısı",
          text: shareText,
          url: window.location.href,
        });
        setShared(true);
      } catch (error) {
        console.log("Sharing failed", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="px-6 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
    >
      {shared ? "Paylaşıldı!" : "Paylaş"}
      <span className="ml-2">{shared ? "✓" : "🔗"}</span>
    </motion.button>
  );
}
