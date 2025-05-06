"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const ModernFeatureCard = ({
  title,
  description,
  icon,
  color,
  link,
  linkText,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 border ${color} card-hover-effect group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-green-100 to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>

      {/* Animated circles */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-green-200 opacity-0 ${
          isHovered ? "animate-ping" : ""
        }`}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-green-100 opacity-0 ${
          isHovered ? "animate-ping" : ""
        } delay-200`}
      ></div>

      <div className="relative z-10">
        <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        <a
          href={link}
          className="inline-flex items-center text-green-600 font-medium hover:underline group-hover:translate-x-1 transition-transform duration-300"
        >
          {linkText}{" "}
          <ArrowRight size={16} className="ml-1 group-hover:animate-bounce" />
        </a>
      </div>
    </div>
  );
};

export default ModernFeatureCard;
