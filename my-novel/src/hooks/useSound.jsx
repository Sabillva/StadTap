"use client";

import { useState, useEffect, useCallback } from "react";

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const [currentBgm, setCurrentBgm] = useState(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentBgm) {
        currentBgm.pause();
        currentBgm.src = "";
      }
    };
  }, [currentBgm]);

  const playSound = useCallback(
    (soundPath) => {
      if (isMuted) return;

      const audio = new Audio(soundPath);
      audio.volume = 0.5;
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    },
    [isMuted]
  );

  const toggleBgm = useCallback(
    (bgmPath) => {
      if (bgmPath) {
        if (currentBgm) {
          currentBgm.pause();
          currentBgm.src = "";
        }

        if (!isMuted) {
          const audio = new Audio(bgmPath);
          audio.loop = true;
          audio.volume = 0.3;
          audio
            .play()
            .catch((error) => console.error("Error playing BGM:", error));
          setCurrentBgm(audio);
        }
      } else {
        // Toggle mute state
        setIsMuted((prev) => {
          const newMuted = !prev;

          if (currentBgm) {
            if (newMuted) {
              currentBgm.pause();
            } else {
              currentBgm
                .play()
                .catch((error) => console.error("Error resuming BGM:", error));
            }
          }

          return newMuted;
        });
      }
    },
    [currentBgm, isMuted]
  );

  return { playSound, toggleBgm, isMuted };
}
