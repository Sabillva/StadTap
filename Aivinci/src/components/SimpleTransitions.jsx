"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Landmark,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import ModernFeatureCard from "./ModernFeatureCard";

const items = [
  {
    id: 1,
    title: "Aivinci Star kartı",
    description:
      "Üstünlüklərlə dolu bu kartla ürəyincə xərclə, məbləği ay sonu geri qaytardıqda əlavə heç nə ödəmə.",
    icon: <CreditCard className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400",
    link: "#",
    linkText: "Ətraflı",
    features: [
      { text: "10% keşbek", icon: <Star className="w-4 h-4" /> },
      { text: "0% komissiya", icon: <Shield className="w-4 h-4" /> },
      { text: "Pulsuz çatdırılma", icon: <Zap className="w-4 h-4" /> },
    ],
  },
  {
    id: 2,
    title: "Nağd pul krediti",
    description:
      "50 000 AZN-dək krediti sərfəli şərtlərlə, asanlıqla və çox qısa zamanda əldə et.",
    icon: <DollarSign className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-r from-teal-500 to-emerald-600 border-teal-400",
    link: "#",
    linkText: "Ətraflı",
    features: [
      { text: "Sürətli təsdiq", icon: <Zap className="w-4 h-4" /> },
      { text: "Aşağı faiz", icon: <Star className="w-4 h-4" /> },
      { text: "Uzun müddət", icon: <Shield className="w-4 h-4" /> },
    ],
  },
  {
    id: 3,
    title: "Əmanət hesabı",
    description:
      "Pulunuzu təhlükəsiz saxlayın və yüksək faiz dərəcələri ilə qazanc əldə edin.",
    icon: <Landmark className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-500",
    link: "#",
    linkText: "Ətraflı",
    features: [
      { text: "12% illik faiz", icon: <Star className="w-4 h-4" /> },
      { text: "Tam təhlükəsizlik", icon: <Shield className="w-4 h-4" /> },
      { text: "Aylıq ödəniş", icon: <Zap className="w-4 h-4" /> },
    ],
  },
];

const SimpleTransitions = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
        theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"
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
            >
              <ModernFeatureCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                link={item.link}
                linkText={item.linkText}
                features={item.features}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleTransitions;
