"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

const GLOVE_SIZE = 50; // Əlcək üçün ölçü
const BALL_SIZE = 40; // Top üçün ölçü

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isCursorPointer, setIsCursorPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);

  // Create portal container on mount
  useEffect(() => {
    // Create a new div element for the portal
    const cursorContainer = document.createElement("div");
    cursorContainer.id = "cursor-container";
    cursorContainer.style.position = "fixed";
    cursorContainer.style.top = "0";
    cursorContainer.style.left = "0";
    cursorContainer.style.width = "100%";
    cursorContainer.style.height = "100%";
    cursorContainer.style.pointerEvents = "none";
    cursorContainer.style.zIndex = "999999"; // Extremely high z-index

    // Append to body
    document.body.appendChild(cursorContainer);
    setPortalContainer(cursorContainer);

    return () => {
      // Clean up on unmount
      if (cursorContainer && document.body.contains(cursorContainer)) {
        document.body.removeChild(cursorContainer);
      }
    };
  }, []);

  // Update cursor position on mouse move
  const updatePosition = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Check if cursor is over clickable elements
  const updateCursorType = useCallback(() => {
    const hoveredElement = document.elementFromPoint(position.x, position.y);

    if (hoveredElement) {
      const computedStyle = window.getComputedStyle(hoveredElement);
      setIsPointer(computedStyle.cursor === "pointer");

      // Check if element has cursor-pointer class
      setIsCursorPointer(
        hoveredElement.classList.contains("cursor-pointer") ||
          hoveredElement.closest(".cursor-pointer") !== null
      );
    } else {
      setIsPointer(false);
      setIsCursorPointer(false);
    }
  }, [position]);

  // Handle mouse down/up events
  const handleMouseDown = useCallback(() => setIsActive(true), []);
  const handleMouseUp = useCallback(() => setIsActive(false), []);

  // Handle mouse enter/leave events
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    // Apply global styles to hide the default cursor
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const interval = setInterval(updateCursorType, 100);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);

      document.head.removeChild(styleElement);
      clearInterval(interval);
    };
  }, [
    updatePosition,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    updateCursorType,
  ]);

  if (!isVisible || !portalContainer) return null;

  // Determine which cursor to show
  const showBall = isCursorPointer;
  const cursorSize = showBall ? BALL_SIZE : GLOVE_SIZE;

  const cursorContent = (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: position.x - cursorSize / 2,
        y: position.y - cursorSize / 2,
        pointerEvents: "none",
        transformOrigin: "center",
        filter:
          isPointer && !showBall
            ? "brightness(1.2) drop-shadow(0 0 5px rgba(255, 215, 0, 0.7))"
            : "none",
      }}
      animate={{
        scale: isActive ? 0.8 : isPointer ? 1.1 : 1,
        rotate: showBall && isActive ? 360 : showBall ? 0 : isPointer ? -15 : 0, // Top tıklandıqda fırlanır
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        rotate: {
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.5,
        },
      }}
    >
      <img
        src={showBall ? "/images/ball.png" : "/images/glove.png"}
        alt="Cursor"
        width={cursorSize}
        height={cursorSize}
        style={{
          width: cursorSize,
          height: "auto",
          objectFit: "contain",
        }}
      />
    </motion.div>
  );

  return createPortal(cursorContent, portalContainer);
}
