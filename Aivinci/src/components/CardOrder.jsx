"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowRight, CreditCard, Shield, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

const CardOrder = ({ theme }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x, y });
      setRotation({ x: y * 15, y: x * -15 });
    };

    const handleMouseLeave = () => {
      if (!cardRef.current) return;
      setRotation({ x: 0, y: 0 });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const features = [
    { icon: <Star className="w-5 h-5" />, text: "10% keşbek imkanı" },
    { icon: <Shield className="w-5 h-5" />, text: "Tam təhlükəsizlik" },
    { icon: <Zap className="w-5 h-5" />, text: "Sürətli ödənişlər" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-200"
      } transition-colors duration-500`}
      ref={sectionRef}
    >
      <div
        className={`rounded-3xl overflow-hidden gradient-animation relative shadow-2xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-green-800 to-emerald-900"
            : "bg-gradient-to-br from-green-600 to-emerald-700"
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-green-50 opacity-10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-green-50 opacity-5 rounded-full"></div>
          <div className="absolute top-40 right-40 w-20 h-20 bg-green-50 opacity-10 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={containerVariants}
              className="md:w-1/2 mb-12 md:mb-0"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-bold text-green-50 mb-6 font-display leading-tight"
              >
                Aivinci kartları ilə xüsusi təklif və imkanlardan yararlan
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-green-50 mb-8 text-lg"
              >
                Visa və MasterCard® beynəlxalq ödəniş sistemlərini dəstəkləyən
                kartlarla dünyanın istənilən yerində ödənişlər etmək imkanına
                sahib ol.
              </motion.p>

              <motion.div
                variants={containerVariants}
                className="space-y-4 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center text-green-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-50 bg-opacity-20 flex items-center justify-center mr-3">
                      {feature.icon}
                    </div>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                variants={itemVariants}
                className="inline-flex items-center bg-green-50 text-green-700 px-8 py-4 rounded-full font-medium hover:bg-green-100 transition group shadow-xl"
              >
                Daha ətraflı{" "}
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
            </motion.div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-green-50 bg-opacity-10 backdrop-blur-sm rounded-2xl transform -rotate-6 scale-105"></div>
                <motion.div
                  ref={cardRef}
                  className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-8 rounded-2xl shadow-2xl transition-all duration-300"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  }}
                >
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-green-50 font-bold text-xl font-display">
                        Aivinci Bank
                      </h3>
                      <p className="text-green-100 text-sm">Premium Card</p>
                    </div>
                    <CreditCard className="text-green-50" size={32} />
                  </div>
                  <div className="mb-6">
                    <p className="text-green-100 text-xs mb-1">Card Number</p>
                    <p className="text-green-50 font-mono text-lg tracking-wider">
                      •••• •••• •••• 4242
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-green-100 text-xs mb-1">Card Holder</p>
                      <p className="text-green-50">AIVINCI USER</p>
                    </div>
                    <div>
                      <p className="text-green-100 text-xs mb-1">Expires</p>
                      <p className="text-green-50">05/28</p>
                    </div>
                  </div>

                  {/* Chip */}
                  <motion.div
                    className="absolute top-8 right-8 w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-[0.5] p-1">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-yellow-300 rounded-sm"></div>
                      ))}
                    </div>
                  </motion.div>

                  {/* NFC symbol */}
                  <motion.div
                    className="absolute top-10 left-10 w-6 h-6"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <div className="w-full h-full border-l-2 border-t-2 border-green-50/50 rounded-tl-full"></div>
                    <div className="w-3/4 h-3/4 border-l-2 border-t-2 border-green-50/50 rounded-tl-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-1/2 h-1/2 border-l-2 border-t-2 border-green-50/50 rounded-tl-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  </motion.div>

                  {/* Hologram */}
                  <motion.div
                    className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-300/50 to-yellow-500/50 backdrop-blur-sm shimmer"
                    style={{ transform: "translateZ(15px)" }}
                  ></motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardOrder;
