"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameData } from "./data/gameData";
import SoundButton from "./components/SoundButton";
import MenuButton from "./components/MenuButton";
import SaveLoadMenu from "./components/SaveLoadMenu";
import { useSound } from "./hooks/useSound";

function App() {
  const [currentScene, setCurrentScene] = useState(null);
  const [textDisplay, setTextDisplay] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [textSpeed] = useState(30); // ms per character
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [isPageTurning, setIsPageTurning] = useState(false);

  const { playSound, toggleBgm, isMuted } = useSound();
  const backgroundRef = useRef(null);

  // Initialize the game with the first scene
  useEffect(() => {
    setCurrentScene(gameData.intro);
    setGameHistory(["intro"]);
  }, []);

  // Apply background effects
  useEffect(() => {
    if (!currentScene?.backgroundEffect || !backgroundRef.current) return;

    const effect = currentScene.backgroundEffect;

    if (effect.type === "zoom") {
      const zoomDirection = effect.direction === "in" ? 1.3 : 0.8;
      setZoomLevel(zoomDirection);

      setTimeout(() => {
        setZoomLevel(1);
      }, (effect.duration || 2) * 1000);
    }

    if (effect.type === "pan") {
      const panAmount = 50; // pixels
      let newX = 0;
      let newY = 0;

      if (effect.direction === "left") newX = -panAmount;
      if (effect.direction === "right") newX = panAmount;
      if (effect.direction === "up") newY = -panAmount;
      if (effect.direction === "down") newY = panAmount;

      setPanPosition({ x: newX, y: newY });

      setTimeout(() => {
        setPanPosition({ x: 0, y: 0 });
      }, (effect.duration || 3) * 1000);
    }
  }, [currentScene]);

  // Play sound effects and BGM
  useEffect(() => {
    if (!currentScene) return;

    if (currentScene.soundEffect) {
      playSound(currentScene.soundEffect);
    }

    if (currentScene.bgm) {
      toggleBgm(currentScene.bgm);
    }
  }, [currentScene, playSound, toggleBgm]);

  // Text animation effect
  useEffect(() => {
    if (!currentScene) return;

    setIsTextComplete(false);
    setTextDisplay("");

    if (currentScene.textEffect === "none") {
      setTextDisplay(currentScene.text);
      setIsTextComplete(true);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < currentScene.text.length) {
        setTextDisplay((prev) => prev + currentScene.text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsTextComplete(true);
      }
    }, textSpeed);

    return () => clearInterval(timer);
  }, [currentScene, textSpeed]);

  // Handle advancing to the next scene
  const handleAdvance = () => {
    if (!currentScene) return;

    // If text is still being displayed, show it all immediately
    if (!isTextComplete) {
      setTextDisplay(currentScene.text);
      setIsTextComplete(true);
      return;
    }

    // If there's a next scene, transition to it
    if (currentScene.nextSceneId) {
      if (currentScene.isPageTurn) {
        handlePageTurn(currentScene.nextSceneId);
      } else {
        handleSceneTransition(currentScene.nextSceneId);
      }
    }
  };

  // Handle player choices
  const handleChoice = (choice) => {
    playSound("/sounds/click.mp3");
    handleSceneTransition(choice.nextSceneId);
  };

  // Handle scene transitions
  const handleSceneTransition = (nextSceneId) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentScene(gameData[nextSceneId]);
      setGameHistory((prev) => [
        ...prev.slice(0, currentHistoryIndex + 1),
        nextSceneId,
      ]);
      setCurrentHistoryIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle page turn animation
  const handlePageTurn = (nextSceneId) => {
    setIsPageTurning(true);
    playSound("/sounds/page-turn.mp3");

    setTimeout(() => {
      setCurrentScene(gameData[nextSceneId]);
      setGameHistory((prev) => [
        ...prev.slice(0, currentHistoryIndex + 1),
        nextSceneId,
      ]);
      setCurrentHistoryIndex((prev) => prev + 1);
      setIsPageTurning(false);
    }, 1000);
  };

  // Save and load game
  const saveGame = (slotId) => {
    const saveData = {
      currentSceneId: currentScene?.id,
      gameHistory,
      currentHistoryIndex,
    };
    localStorage.setItem(`visualNovelSave_${slotId}`, JSON.stringify(saveData));
    playSound("/sounds/save.mp3");
    setShowMenu(false);
  };

  const loadGame = (slotId) => {
    const saveData = localStorage.getItem(`visualNovelSave_${slotId}`);
    if (saveData) {
      const {
        currentSceneId,
        gameHistory: loadedHistory,
        currentHistoryIndex: loadedIndex,
      } = JSON.parse(saveData);
      setCurrentScene(gameData[currentSceneId]);
      setGameHistory(loadedHistory);
      setCurrentHistoryIndex(loadedIndex);
      playSound("/sounds/load.mp3");
      setShowMenu(false);
    }
  };

  if (!currentScene)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Menu and Control Buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <SoundButton isMuted={isMuted} toggleMute={() => toggleBgm()} />
        <MenuButton onClick={() => setShowMenu(!showMenu)} />
      </div>

      {/* Save/Load Menu */}
      {showMenu && (
        <SaveLoadMenu
          onSave={saveGame}
          onLoad={loadGame}
          onClose={() => setShowMenu(false)}
        />
      )}

      {/* Page Turn Animation */}
      <AnimatePresence>
        {isPageTurning && (
          <motion.div
            className="absolute inset-0 z-40 bg-white"
            initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Main Game Container */}
      <div className="relative h-full w-full">
        {/* Background with effects */}
        <motion.div
          ref={backgroundRef}
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${currentScene.background})`,
            opacity: isTransitioning ? 0 : 1,
          }}
          animate={{
            scale: zoomLevel,
            x: panPosition.x,
            y: panPosition.y,
          }}
          transition={{ duration: 1.5 }}
        />

        {/* Manga Panels Layout */}
        {currentScene.panelStyle === "manga" && currentScene.mangaPanels && (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-4">
            {currentScene.mangaPanels.map((panel, index) => {
              const sizeClasses = {
                small: "w-full h-full",
                medium: "w-full h-full",
                large: "col-span-2 row-span-2",
              };

              const positionClasses = {
                topLeft: "col-start-1 row-start-1",
                topRight: "col-start-2 row-start-1",
                bottomLeft: "col-start-1 row-start-2",
                bottomRight: "col-start-2 row-start-2",
                center: "col-start-1 col-span-2 row-start-1 row-span-2",
              };

              return (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden border-2 border-black bg-white ${
                    sizeClasses[panel.size]
                  } ${positionClasses[panel.position]}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <img
                    src={panel.image || "/placeholder.svg"}
                    alt={`Panel ${index}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Characters */}
        <AnimatePresence>
          {currentScene.characters?.map((character, index) => {
            const positionClasses = {
              left: "left-10",
              center: "left-1/2 -translate-x-1/2",
              right: "right-10",
            };

            const animationVariants = {
              fadeIn: {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.5 },
              },
              slideIn: {
                initial: {
                  x:
                    character.position === "left"
                      ? -100
                      : character.position === "right"
                      ? 100
                      : 0,
                  opacity: 0,
                },
                animate: { x: 0, opacity: 1 },
                transition: { duration: 0.5 },
              },
              bounce: {
                initial: { y: -20, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              },
              shake: {
                initial: { x: 0 },
                animate: {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.5 },
                },
              },
              none: {
                initial: { opacity: 1 },
                animate: { opacity: 1 },
              },
            };

            const animation = character.animation || "fadeIn";

            return (
              <motion.div
                key={`${character.name}-${index}`}
                className={`absolute bottom-0 h-4/5 ${
                  positionClasses[character.position]
                }`}
                initial={animationVariants[animation].initial}
                animate={animationVariants[animation].animate}
                transition={animationVariants[animation].transition}
                exit={{ opacity: 0 }}
              >
                <img
                  src={character.image || "/placeholder.svg"}
                  alt={character.name}
                  className="h-full w-auto object-contain"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Text Box */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-6 text-white min-h-[200px] border-t border-gray-700"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Speaker Name */}
        {currentScene.speaker && (
          <div
            className="absolute -top-10 left-8 px-4 py-2 rounded-t-lg font-bold"
            style={{ backgroundColor: currentScene.speakerColor || "#6d28d9" }}
          >
            {currentScene.speaker}
          </div>
        )}

        {/* Dialogue Text */}
        <p className="text-lg mb-4 font-medium">{textDisplay}</p>

        {/* Choices or Continue */}
        <div className="mt-4">
          {isTextComplete && currentScene.choices ? (
            <div className="flex flex-col space-y-2">
              {currentScene.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="text-left px-4 py-2 bg-purple-900 hover:bg-purple-800 rounded-md transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  {choice.text}
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.button
              onClick={handleAdvance}
              className="absolute bottom-4 right-4 bg-transparent hover:bg-purple-900 p-2 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
