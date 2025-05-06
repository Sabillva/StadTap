"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowRight, DollarSign, Gift, Landmark } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Onlayn kredit",
    description: "Krediti banka gəlmədən və növbə gözləmədən əldə et",
    buttonText: "Sifariş et",
    color: "from-green-400 to-green-600",
    textColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
    icon: <DollarSign className="w-8 h-8 text-green-50" />,
  },
  {
    id: 2,
    title: "Kampaniyalar",
    description: "Sərfəli təklif və endirimlərimizi vaxt itirmədən dəyərləndir",
    buttonText: "Daha ətraflı",
    color: "from-emerald-400 to-emerald-600",
    textColor: "text-emerald-600",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    icon: <Gift className="w-8 h-8 text-green-50" />,
  },
  {
    id: 3,
    title: "Depozit",
    description:
      "İstər filialda, istərsə də onlayn depozit yerləşdir, qazancını çoxalt",
    buttonText: "Sifariş et",
    color: "from-green-500 to-emerald-600",
    textColor: "text-green-700",
    buttonColor: "bg-green-700 hover:bg-green-800",
    icon: <Landmark className="w-8 h-8 text-green-50" />,
  },
];

const AdditionalServices = ({ theme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const getCardStyle = (id) => {
    if (hoveredCard !== id) return {};

    const x = mousePosition.x * 5;
    const y = mousePosition.y * 5;
    return {
      transform: `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`,
    };
  };

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-300"
      } transition-colors duration-500`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="h-1 w-20 bg-green-500 mb-4"
          ></motion.div>
          <motion.h2
            variants={itemVariants}
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Əlavə xidmətlər
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Aivinci Bank-ın təqdim etdiyi digər xidmətlərlə tanış olun
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                theme === "dark"
                  ? "border border-gray-700"
                  : "border border-gray-200"
              }`}
              style={{
                transformStyle: "preserve-3d",
                ...getCardStyle(service.id),
              }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => handleMouseMove(e, service.id)}
            >
              <div
                className={`h-full flex flex-col ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className={`p-6 bg-gradient-luxury ${service.color}`}>
                  <div className="w-16 h-16 rounded-full bg-green-50 bg-opacity-20 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-green-50 mb-2 font-display">
                    {service.title}
                  </h3>
                  <p className="text-green-50 text-opacity-90">
                    {service.description}
                  </p>
                </div>

                <div className="p-6 flex-grow flex items-end">
                  <button
                    className={`w-full text-green-50 px-6 py-4 rounded-xl font-medium transition-all ${service.buttonColor} relative overflow-hidden group flex items-center justify-center`}
                  >
                    <span className="relative z-10">{service.buttonText}</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="absolute inset-0 h-full w-0 bg-green-50 bg-opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;
