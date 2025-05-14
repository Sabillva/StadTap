"use client";

import { useState } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, DollarSign, Gift, Landmark } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Onlayn kredit",
    description: "Krediti banka gəlmədən və növbə gözləmədən əldə et",
    buttonText: "Sifariş et",
    color: "from-emerald-400 to-teal-600",
    textColor: "text-emerald-600",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    icon: <DollarSign className="w-8 h-8 text-white" />,
  },
  {
    id: 2,
    title: "Kampaniyalar",
    description: "Sərfəli təklif və endirimlərimizi vaxt itirmədən dəyərləndir",
    buttonText: "Daha ətraflı",
    color: "from-teal-400 to-emerald-600",
    textColor: "text-teal-600",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
    icon: <Gift className="w-8 h-8 text-white" />,
  },
  {
    id: 3,
    title: "Depozit",
    description:
      "İstər filialda, istərsə də onlayn depozit yerləşdir, qazancını çoxalt",
    buttonText: "Sifariş et",
    color: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-700",
    buttonColor: "bg-emerald-700 hover:bg-emerald-800",
    icon: <Landmark className="w-8 h-8 text-white" />,
  },
];

const AdditionalServices = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  return (
    <section
      className={`py-24 ${
        theme === "dark" ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      } transition-colors duration-500`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Əlavə xidmətlər
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Aivinci Bank-ın təqdim etdiyi digər xidmətlərlə tanış olun
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                theme === "dark"
                  ? "border border-neutral-800"
                  : "border border-neutral-200"
              }`}
              style={{
                transformStyle: "preserve-3d",
                ...getCardStyle(service.id),
              }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => handleMouseMove(e, service.id)}
              data-cursor="link"
            >
              <div
                className={`h-full flex flex-col ${
                  theme === "dark" ? "bg-[#111111]" : "bg-white"
                }`}
              >
                <div className={`p-6 bg-gradient-to-r ${service.color}`}>
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-display">
                    {service.title}
                  </h3>
                  <p className="text-white text-opacity-90">
                    {service.description}
                  </p>
                </div>

                <div className="p-6 flex-grow flex items-end">
                  <button
                    className={`w-full text-white px-6 py-4 rounded-xl font-medium transition-all bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 relative overflow-hidden group flex items-center justify-center`}
                    data-cursor="button"
                  >
                    <span className="relative z-10">{service.buttonText}</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="absolute inset-0 h-full w-0 bg-white bg-opacity-20 transition-all duration-300 group-hover:w-full"></span>
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
