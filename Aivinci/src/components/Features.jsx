"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  DollarSign,
  Landmark,
  Star,
  Shield,
  Zap,
} from "lucide-react";

const items = [
  {
    id: 1,
    title: "Aivinci Star kartı",
    description:
      "Üstünlüklərlə dolu bu kartla ürəyincə xərclə, məbləği ay sonu geri qaytardıqda əlavə heç nə ödəmə.",
    icon: <CreditCard className="w-8 h-8 text-white" />,
    color: "from-emerald-400 to-teal-600",
    link: "#",
    linkText: "Ətraflı",
    features: ["10% keşbek", "0% komissiya", "Pulsuz çatdırılma"],
    featureIcons: [
      <Star key="star" className="w-4 h-4" />,
      <Shield key="shield" className="w-4 h-4" />,
      <Zap key="zap" className="w-4 h-4" />,
    ],
  },
  {
    id: 2,
    title: "Nağd pul krediti",
    description:
      "50 000 AZN-dək krediti sərfəli şərtlərlə, asanlıqla və çox qısa zamanda əldə et.",
    icon: <DollarSign className="w-8 h-8 text-white" />,
    color: "from-teal-400 to-emerald-600",
    link: "#",
    linkText: "Ətraflı",
    features: ["Sürətli təsdiq", "Aşağı faiz", "Uzun müddət"],
    featureIcons: [
      <Zap key="zap" className="w-4 h-4" />,
      <Star key="star" className="w-4 h-4" />,
      <Shield key="shield" className="w-4 h-4" />,
    ],
  },
  {
    id: 3,
    title: "Əmanət hesabı",
    description:
      "Pulunuzu təhlükəsiz saxlayın və yüksək faiz dərəcələri ilə qazanc əldə edin.",
    icon: <Landmark className="w-8 h-8 text-white" />,
    color: "from-emerald-500 to-teal-600",
    link: "#",
    linkText: "Ətraflı",
    features: ["12% illik faiz", "Tam təhlükəsizlik", "Aylıq ödəniş"],
    featureIcons: [
      <Star key="star" className="w-4 h-4" />,
      <Shield key="shield" className="w-4 h-4" />,
      <Zap key="zap" className="w-4 h-4" />,
    ],
  },
];

const Features = ({ theme }) => {
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

    const x = mousePosition.x * 10;
    const y = mousePosition.y * 10;
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
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 text-center ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            Sadə keçidlər
          </h2>
          <p
            className={`max-w-2xl text-center text-lg ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            Aivinci Bank ilə maliyyə ehtiyaclarınızı qarşılamaq üçün ən sərfəli
            həllər
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 group h-full`}
              style={{
                transformStyle: "preserve-3d",
                ...getCardStyle(item.id),
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
            >
              {/* Background gradient with animation */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.color} transition-all duration-500`}
              ></div>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

              {/* Animated circles on hover */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/30 opacity-0 ${
                  hoveredCard === item.id ? "animate-ping" : ""
                }`}
              ></div>
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/20 opacity-0 ${
                  hoveredCard === item.id ? "animate-ping" : ""
                } delay-200`}
              ></div>

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 font-display">
                  {item.title}
                </h3>
                <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-grow">
                  {item.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-white text-opacity-90"
                    >
                      <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                        {item.featureIcons[idx]}
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={item.link}
                  className="inline-flex items-center text-white font-medium group-hover:underline transition-all duration-300 group mt-auto"
                  data-cursor="link"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight
                    size={18}
                    className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2"
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
