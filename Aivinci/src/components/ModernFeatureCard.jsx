"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ModernFeatureCard = ({
  title,
  description,
  icon,
  color,
  link,
  linkText,
  features,
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * 10, y: x * -10 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden shadow-xl h-full ${color} border border-opacity-20`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${
          rotation.y
        }deg) scale(${isHovered ? 1.02 : 1})`,
        transition: "transform 0.2s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isHovered ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            style={{ transform: "translateZ(20px)" }}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 mb-6 flex-grow">{description}</p>

        {features && features.length > 0 && (
          <div className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-white/90 text-sm"
                style={{
                  transform: `translateZ(${isHovered ? 20 : 0}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        )}

        <a
          href={link}
          className="inline-flex items-center text-white font-medium hover:underline mt-auto group"
          style={{
            transform: `translateZ(${isHovered ? 30 : 0}px)`,
            transition: "transform 0.3s ease-out",
          }}
          data-cursor="link"
        >
          {linkText}{" "}
          <ArrowRight
            size={16}
            className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5"
        style={{
          transform: `translate(50%, -50%) translateZ(${
            isHovered ? -10 : -20
          }px)`,
          transition: "transform 0.3s ease-out",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5"
        style={{
          transform: `translate(-50%, 50%) translateZ(${
            isHovered ? -10 : -20
          }px)`,
          transition: "transform 0.3s ease-out",
        }}
      ></div>
    </motion.div>
  );
};

export default ModernFeatureCard;
